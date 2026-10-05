import type {Content} from './types';
import {AppError,generate} from './server';
export type EbookProgress={parts:Content[]};
export async function generateEbook(input:any,token:string,progress:EbookProgress,checkpoint:(stage:string)=>Promise<void>):Promise<Content>{
 if(process.env.GEMINI_API_KEY)return generate(input,token);
 // The legacy ebook endpoint emits a large document then rewrites it in one request.
 // Use its smaller, image-aware section schema and persist each completed part.
 for(let i=progress.parts.length;i<2;i++){await checkpoint(`전자책 ${i*3+1}~${i*3+3}장 생성 중 (${i*3}/6장 저장됨)`);const prior=progress.parts[0];const guide=i===0?'1장: 주제의 이해와 학습 목표. 2장: 기본 원리와 준비. 3장: 단계별 실천의 시작.':'4장: 심화 적용과 사례. 5장: 자주 하는 실수와 해결. 6장: 실습·체크리스트와 전체 요약.';
 try{const c=await generate({...input,format:'article',gatewayTimeoutMs:90000,instruction:`전문 전자책을 두 부분으로 제작합니다. 이것은 기사가 아니라 ${input.audience||'일반 독자'}를 위한 전자책 장별 본문입니다. 이번에는 전체 6장 중 ${i===0?'앞 3장':'뒤 3장'}만 작성하세요. sections는 정확히 3개이며 heading은 각 장의 짧은 소제목, body/blocks는 해당 장의 학습 목표·구체적 설명·가정 예시·실습을 포함합니다. 각 장은 500~900자 안팎으로 완결성 있게 작성하고 중복·임의 통계를 피하세요. 전체 표제는 '${input.topic}'로 유지하세요. ${guide}\n선택 기획과 사용자 제작 방향: ${String(input.instruction||'').slice(0,2300)}\n${prior?'이미 완료한 앞부분 목차(반복하지 말 것): '+prior.sections.map(s=>s.heading).join(' / '):''}`,originalContent:undefined},token);if(c.sections.length!==3)throw new AppError('이번 부분의 3개 장 구성이 완성되지 않았습니다.',502);progress.parts.push(c);await checkpoint(`전자책 ${(i+1)*3}/6장 저장 완료`);}catch(e){throw new AppError(`전자책 ${i*3+1}~${i*3+3}장 생성이 중단됐습니다. 저장한 ${progress.parts.length*3}장은 유지됩니다. 같은 설정으로 제작하기를 다시 누르면 이어서 처리합니다. ${e instanceof Error?e.message:''}`,502);}}
 const [a,b]=progress.parts;const sections=[...a.sections,...b.sections].map((s,i)=>({...s,id:`section-${i}`}));if(sections.length!==6||new Set(sections.map(s=>s.heading)).size!==6){progress.parts.splice(1);await checkpoint('뒤 3장 구성 재생성 필요 · 앞 3장 유지');throw new AppError('뒤 3장의 소제목이 앞부분과 중복됐습니다. 다시 제작하기를 누르면 뒤 3장만 재작성합니다.',502);}
 return {...a,title:String(input.topic||a.title).slice(0,160),intro:a.intro,sections,closing:b.closing,sources:String(input.sources||'').split('\n').filter(Boolean),review:`6개 장의 제목·본문과 선택 사진 배치를 확인했습니다.\n앞부분: ${a.review}\n뒷부분: ${b.review}\n전체 장 사이의 의미적 연결과 사실 확인은 공개 전 전문 검수로 확인해주세요.`};
}
