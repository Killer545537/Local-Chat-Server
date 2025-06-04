import { PageLayout } from '@/components/info/page-layout';

export default function PrivacyPage() {
    return (
        <PageLayout>
            <main className='flex w-full flex-grow flex-col items-center justify-center py-16 lg:p-8'>
                <div className='flex w-full flex-col space-y-6 sm:w-[550px] md:w-[700px] lg:w-[800px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>Privacy Policy</h1>
                        <p className='text-muted-foreground text-sm'>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className='text-muted-foreground space-y-4'>
                        <p>
                            Your privacy is important to us. It is Local Chat&#39;s policy to respect your privacy
                            regarding any information we may collect from you across our website, and other sites we own
                            and operate.
                        </p>
                        <p>
                            We only ask for personal information when we truly need it to provide a service to you. We
                            collect it by fair and lawful means, with your knowledge and consent. We also let you know
                            why we’re collecting it and how it will be used.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Information We Collect</h2>
                        <p>
                            Log data: When you visit our website, our servers may automatically log the standard data
                            provided by your web browser. It may include your computer’s Internet Protocol (IP) address,
                            your browser type and version, the pages you visit, the time and date of your visit, the
                            time spent on each page, and other details.
                        </p>
                        <p>
                            Device data: We may also collect data about the device you’re using to access our website.
                            This data may include the device type, operating system, unique device identifiers, device
                            settings, and geo-location data.
                        </p>
                        <p>
                            Personal information: We may ask for personal information, such as your name, email, social
                            media profiles, date of birth, telephone/mobile number, home/mailing address, payment
                            information.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>How We Use Information</h2>
                        <p>
                            We may use a combination of identifying and non-identifying information to understand who
                            our visitors are, how they use our services, and how we may improve their experience of our
                            website in future. We do not disclose the specifics of this information publicly, but may
                            share aggregated and anonymised versions of this information, for example, in website usage
                            trend reports.
                        </p>
                        <p>
                            We may use your personal details to contact you with updates about our website and services,
                            along with promotional content that we believe may be of interest to you.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Data Processing and Storage</h2>
                        <p>
                            The personal information we collect is stored and processed where we or our partners,
                            affiliates, and third-party providers maintain facilities. We only transfer data within
                            jurisdictions subject to data protection laws that reflect our commitment to protecting the
                            privacy of our users.
                        </p>
                        <p>
                            We only retain personal information for as long as necessary to provide a service, or to
                            improve our services in future. While we retain this data, we will protect it within
                            commercially acceptable means to prevent loss and theft, as well as unauthorized access,
                            disclosure, copying, use, or modification.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Your Rights</h2>
                        <p>
                            You have the right to be informed about how your data is collected and used. You are
                            entitled to know what data we collect about you, and how it is processed. You are entitled
                            to correct and update any personal information about you, and to request this information be
                            deleted.
                        </p>
                        <p>
                            You may amend your account information at any time, using the tools provided in your account
                            control panel.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Children&#39;s Privacy</h2>
                        <p>
                            This website does not knowingly collect any personally identifiable information from
                            children under the age of 13. If you think that your child provided this kind of information
                            on our website, we strongly encourage you to contact us immediately and we will do our best
                            efforts to promptly remove such information from our records.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Limits of Our Policy</h2>
                        <p>
                            Our website may link to external sites that are not operated by us. Please be aware that we
                            have no control over the content and policies of those sites, and cannot accept
                            responsibility or liability for their respective privacy practices.
                        </p>

                        <h2 className='text-primary pt-4 text-xl font-medium'>Changes to This Policy</h2>
                        <p>
                            At our discretion, we may change our privacy policy to reflect current acceptable practices.
                            We will take reasonable steps to let users know about changes via our website. Your
                            continued use of this site after any changes to this policy will be regarded as acceptance
                            of our practices around privacy and personal information.
                        </p>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
