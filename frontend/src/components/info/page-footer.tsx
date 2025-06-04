import Link from 'next/link';
import {Github, Linkedin} from "lucide-react";

export const PageFooter = () => (
    <footer className="mt-auto w-full border-t py-4">
        <div className="container flex justify-center gap-6">
            <Link href="https://github.com/Killer545537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
                <Github className='h-5 w-5'/>
                Github
            </Link>
            <Link href="https://www.linkedin.com/in/srijan-mahajan-035680294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
                <Linkedin className='h-5 w-5'/>
                LinkedIn
            </Link>

        </div>
    </footer>
);