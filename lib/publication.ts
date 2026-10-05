import type {Project} from './types';
import {publicRecords,publicProject} from './server';
import {SITE_ORIGIN} from './site';
export {SITE_ORIGIN} from './site';
export const publicationUrl=(p:Project)=>`${SITE_ORIGIN}/content/${p.publicationId}`;
export const photoUrl=(id:string)=>`${SITE_ORIGIN}/api/hub/image?id=${encodeURIComponent(id)}`;
export const excerpt=(p:Project,max=155)=>(p.content.subtitle||p.content.intro||p.content.sections[0]?.body||p.title).replace(/\s+/g,' ').trim().slice(0,max);
export async function publishedProjects():Promise<Project[]>{return (await publicRecords()).flatMap((d:any):Project[]=>{try{const p=publicProject(d);return p.publicationId&&p.content&&['ebook','sns','article'].includes(p.format)?[p]:[];}catch{return [];}}).sort((a:Project,b:Project)=>b.updatedAt.localeCompare(a.updatedAt));}
export const escapeXml=(s:string)=>s.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export const jsonLd=(v:unknown)=>JSON.stringify(v).replace(/</g,'\\u003c');
export function contentSchema(p:Project){const url=publicationUrl(p),c=p.content;return {'@context':'https://schema.org','@type':p.format==='ebook'?'Book':p.format==='sns'?'SocialMediaPosting':'Article','@id':url+'#content',url,name:c.title,headline:c.title,description:excerpt(p),inLanguage:'ko-KR',datePublished:p.createdAt,dateModified:p.updatedAt,author:{'@type':'Organization',name:'허브스튜디오3 편집실',url:SITE_ORIGIN},publisher:{'@type':'Organization',name:'허브스튜디오3',url:SITE_ORIGIN},mainEntityOfPage:{'@type':'WebPage','@id':url},...(p.imageIds[0]?{image:photoUrl(p.imageIds[0])}:{}),...(p.format==='ebook'?{bookFormat:'https://schema.org/EBook',hasPart:c.sections.map(s=>({'@type':'Chapter',name:s.heading}))}:{articleBody:p.format==='sns'?c.feeds.map(f=>`${f.platform}\n${f.hook}\n${f.body}`).join('\n\n'):[c.intro,...c.sections.map(s=>`${s.heading}\n${s.body}`),c.closing].join('\n\n')})};}
