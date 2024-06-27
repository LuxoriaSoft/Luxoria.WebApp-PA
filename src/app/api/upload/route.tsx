import {NextApiRequest, NextApiResponse} from "next";

export async function GET(req: NextApiRequest) {

    return new Response(
        JSON.stringify({
            message: "Hello World",
        }
    ), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });


}