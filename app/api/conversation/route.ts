import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { checkApiLimit, increaseApiLimit } from '@/lib/apiLimit';
import OpenAI from 'openai';
import { checkSubscription } from '@/lib/subscription';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const { messages } = await req.json();

		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		if (!openai.apiKey) return new NextResponse('OpenAI API KEY not configured', { status: 500 });

		if (!messages) new NextResponse('Message are required', { status: 400 });

		const freeTrial = await checkApiLimit();
		const isPro = await checkSubscription();

		if (!freeTrial && !isPro) return new NextResponse('Free trial has expired.', { status: 403 });

		const response = await openai.chat.completions.create({
			messages: messages,
			model: 'gpt-3.5-turbo',
		});

		if (!isPro) {
			await increaseApiLimit();
		}

		return NextResponse.json(response.choices[0].message);
	} catch (error: any) {
		console.log('[CONVERSATION_ERROR]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
