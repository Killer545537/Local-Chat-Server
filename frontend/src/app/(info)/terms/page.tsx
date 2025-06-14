import { PageLayout } from '@/components/info/page-layout';

export default function TermsPage() {
    return (
        <PageLayout>
            <main className="flex w-full flex-grow flex-col items-center justify-center py-16 lg:p-8">
                <div className="flex w-full flex-col space-y-6 sm:w-[550px] md:w-[700px] lg:w-[800px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
                        <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-muted-foreground space-y-4">
                        <p>
                            Welcome to Local Chat! These terms and conditions outline the rules and regulations for the
                            use of Local Chat&#39;s Website, located at your local network.
                        </p>
                        <p>
                            By accessing this website we assume you accept these terms and conditions. Do not continue
                            to use Local Chat if you do not agree to take all of the terms and conditions stated on this
                            page.
                        </p>

                        <h2 className="text-primary pt-4 text-xl font-medium">Cookies</h2>
                        <p>
                            We employ the use of cookies. By accessing Local Chat, you agreed to use cookies in
                            agreement with the Local Chat&#39;s Privacy Policy.
                        </p>
                        <p>
                            Most interactive websites use cookies to let us retrieve the user&#39;s details for each
                            visit. Cookies are used by our website to enable the functionality of certain areas to make
                            it easier for people visiting our website. Some of our affiliate/advertising partners may
                            also use cookies.
                        </p>

                        <h2 className="text-primary pt-4 text-xl font-medium">License</h2>
                        <p>
                            Unless otherwise stated, Local Chat and/or its licensors own the intellectual property
                            rights for all material on Local Chat. All intellectual property rights are reserved. You
                            may access this from Local Chat for your own personal use subjected to restrictions set in
                            these terms and conditions.
                        </p>
                        <p>You must not:</p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>Republish material from Local Chat</li>
                            <li>Sell, rent or sub-license material from Local Chat</li>
                            <li>Reproduce, duplicate or copy material from Local Chat</li>
                            <li>Redistribute content from Local Chat</li>
                        </ul>
                        <p>This Agreement shall begin on the date hereof.</p>

                        <h2 className="text-primary pt-4 text-xl font-medium">User Comments</h2>
                        <p>
                            Parts of this website offer an opportunity for users to post and exchange opinions and
                            information in certain areas of the website. Local Chat does not filter, edit, publish or
                            review Comments prior to their presence on the website. Comments do not reflect the views
                            and opinions of Local Chat,its agents and/or affiliates. Comments reflect the views and
                            opinions of the person who post their views and opinions.
                        </p>
                        <p>
                            Local Chat reserves the right to monitor all Comments and to remove any Comments which can
                            be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                        </p>

                        <h2 className="text-primary pt-4 text-xl font-medium">Disclaimer</h2>
                        <p>
                            To the maximum extent permitted by applicable law, we exclude all representations,
                            warranties and conditions relating to our website and the use of this website. Nothing in
                            this disclaimer will:
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>limit or exclude our or your liability for death or personal injury;</li>
                            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                            <li>
                                limit any of our or your liabilities in any way that is not permitted under applicable
                                law; or
                            </li>
                            <li>
                                exclude any of our or your liabilities that may not be excluded under applicable law.
                            </li>
                        </ul>
                        <p>
                            The limitations and prohibitions of liability set in this Section and elsewhere in this
                            disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities
                            arising under the disclaimer, including liabilities arising in contract, in tort and for
                            breach of statutory duty.
                        </p>
                        <p>
                            As long as the website and the information and services on the website are provided free of
                            charge, we will not be liable for any loss or damage of any nature.
                        </p>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
