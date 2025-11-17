
import { NextResponse } from 'next/server';

// This is the target URL of your .NET webhook
const TARGET_URL = 'https://utilityking.co.uk/testreactasp.aspx';

export async function POST(request: Request) {
  try {
    const body = await request.text(); // Read the body to forward it

    const apiResponse = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Forward the body from the original request
      body: body,
    });

    // Get the response text to send back to the client
    const responseData = await apiResponse.text();

    // Check if the external API call was successful
    if (!apiResponse.ok) {
      // If not, return the error from the external API
      return new NextResponse(responseData, {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
      });
    }

    // If successful, return the data from the external API
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
