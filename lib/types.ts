export type Format='ebook'|'sns'|'article';
export type Photo={id:string;title:string;tags:string[];ratio:string;url:string};
export type Section={id:string;heading:string;body:string;imageId?:string;caption?:string};
export type Feed={platform:string;hook:string;body:string;hashtags:string[];imageId:string;notes:string};
export type Content={title:string;subtitle:string;intro:string;sections:Section[];closing:string;feeds:Feed[];sources:string[];review:string};
export type Project={id:string;ownerId:string;format:Format;status:'draft'|'published';title:string;topic:string;audience:string;tone:string;imageIds:string[];content:Content;revision:number;updatedAt:string;createdAt:string;publicationId?:string;instruction?:string;planning?:{batch:Planning;selectedId:string}};
export type Session={idToken:string;refreshToken:string;localId:string;email:string;expiresAt:number};
export type Turn={id:string;role:'user'|'assistant';text:string;createdAt:string;projectId?:string};
export const formats={ebook:{label:'전자책',en:'E-BOOK',hint:'목차부터 실습까지, 한 권으로'},sns:{label:'SNS 피드',en:'SOCIAL FEED',hint:'하나의 이야기, 네 가지 채널'},article:{label:'전문 기사',en:'EDITORIAL',hint:'핵심을 선명하게, 근거를 정확하게'}};
export const platforms=['Instagram','Facebook','X','LinkedIn'];

export type Plan={id:string;title:string;audience:string;tone:string;instruction:string;rationale:string;warnings:string[]};
export type Planning={id:string;format:Format;imageIds:string[];imageVersions:string[];createdAt:string;plans:Plan[]};
