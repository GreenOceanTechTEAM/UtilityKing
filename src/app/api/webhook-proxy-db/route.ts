
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    const requestBody = await request.json();

    // The .NET WebMethod expects the payload to be wrapped in an object
    // with a key that matches the method's parameter name ('requestData').
    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.DOTNET_API_KEY || '', 
        },
        body: JSON.stringify({ requestData: requestBody }),
    });
    
    if (!apiResponse.ok) {
        const errorDetails = await apiResponse.text();
        console.error('Error from .NET backend:', errorDetails);
        return NextResponse.json({ d: `Error: ${errorDetails}` }, { status: apiResponse.status });
    }

    // Forward the response from the .NET backend.
    const result = await apiResponse.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    return NextResponse.json(
        { d: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
