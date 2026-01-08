
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The exact target URL of your .NET WebMethod
  const targetUrl = 'https://utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    const requestBody = await request.json();

    // The .NET WebMethod expects the data to be wrapped in a 'requestData' object.
    const payload = {
      requestData: requestBody
    };

    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any necessary auth headers here, like an API key
            'X-API-KEY': process.env.DOTNET_API_KEY || 'your_secure_api_key_here',
        },
        body: JSON.stringify(payload),
    });
    
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`Error from .NET backend (${apiResponse.status}):`, errorText);
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
