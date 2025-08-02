
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

export const SocialShareButtons = ({ postTitle }: { postTitle: string}) => {
    const [postUrl, setPostUrl] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPostUrl(window.location.href);
        }
    }, []);

    if (!postUrl) return null;

    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Share:</span>
            <Button variant="outline" size="icon" asChild>
                <Link href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank">
                    <Twitter className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                 <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank">
                    <Linkedin className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank">
                    <Facebook className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    )
}
