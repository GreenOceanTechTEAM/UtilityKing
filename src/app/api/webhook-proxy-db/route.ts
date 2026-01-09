
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const targetUrl = 'http://server.utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    const requestBody = await request.json();

    const payload = {
      requestData: requestBody
    };

    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.DOTNET_API_KEY || 'your_secure_api_key_here',
        },
        body: JSON.stringify(payload),
    });
    
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`Error from .NET backend (${apiResponse.status}):`, errorText);
        // Ensure a JSON response is sent for errors too
        return NextResponse.json({ message: `Error from backend: ${errorText}` }, { status: apiResponse.status });
    }

    const resultJson = await apiResponse.json();
    
    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    return NextResponse.json(
        { message: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}

    