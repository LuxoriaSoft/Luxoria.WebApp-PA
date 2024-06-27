import {withPageAuthRequired} from "@auth0/nextjs-auth0";

function RootLayout({ children }) {
    return (
        <>
            <html lang="en">
            <body>
            <div className={"container mx-auto mt-5 mb-5"}>
                {children}
            </div>
            </body>
            </html>
        </>
    );
}

export default withPageAuthRequired(RootLayout);
