import {SITE_ORIGIN} from '../../lib/publication';
export const dynamic='force-dynamic';
export function GET(){return new Response(`User-agent: *\nAllow: /\nAllow: /api/hub/image\nDisallow: /api/hub/\nDisallow: /studio\nDisallow: /api/cron/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
