import {authorizeCron,serviceToken} from '../../../../lib/service-auth';
import {runSchedules} from '../../../../lib/schedules';
import {AppError} from '../../../../lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=300;
export async function GET(req:Request,{params}:{params:Promise<{phase:string}>}){try{authorizeCron(req);const {phase}=await params;if(phase!=='prepare'&&phase!=='publish')return Response.json({error:'지원하지 않는 예약 작업'},{status:404});return Response.json(await runSchedules(phase,await serviceToken()),{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:e instanceof Error?e.message:'예약 실행 실패'},{status:e instanceof AppError?e.status:500});}}
