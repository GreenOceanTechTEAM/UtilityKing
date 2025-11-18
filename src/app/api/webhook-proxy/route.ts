
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const targetUrl = 'https://utilityking.co.uk/ProjectService.aspx/reactasp';

  try {
    const requestBody = await request.json();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(
        `Failed to proxy request: ${response.status} ${response.statusText} - ${errorText}`,
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in webhook proxy:', error);
    return new NextResponse(
      `An internal error occurred in the proxy: ${error.message}`,
      { status: 500 }
    );
  }
}
