import { BLOG_ENDPOINT } from '@/lib/constants';
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();

  try {
    const parsedRss = await parser.parseURL(BLOG_ENDPOINT!);
    parsedRss?.items?.forEach((item) => {
      const content = item?.['content:encoded'];
      const thumbnail = content?.match(/<img.*?src="(.*?)"/)?.[1];
      item.thumbnail = thumbnail;
    });
    return NextResponse.json({ message: 'OK', parsedRss }, { status: 200 });
  } catch (error: any) {
    console.log('ERROR: ', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
