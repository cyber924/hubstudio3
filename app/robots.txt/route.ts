import {SITE_ORIGIN} from '../../lib/publication';
export function GET(){return new Response(`User-agent: *\nAllow: /\nAllow: /api/hub/image\nDisallow: /api/hub/\nDisallow: /studio\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
