import { NextResponse } from 'next/server';

// The target URL of your .NET WebMethod
const TARGET_URL = 'https://utilityking.co.uk/ProjectService.aspx/reactasp';

export async function POST(request: Request) {
  try {
    // Correctly read the JSON body from the incoming request.
    const body = await request.json();

    const apiResponse = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Correctly forward the stringified JSON body to the .NET server.
      body: JSON.stringify(body),
    });

    const responseData = await apiResponse.text();

    if (!apiResponse.ok) {
      // If the external API call fails, return its error.
      return new NextResponse(responseData, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If successful, return the data from the .NET API.
    return new NextResponse(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Proxy error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error in proxy', error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
