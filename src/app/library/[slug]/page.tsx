
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, FileText, BookText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LibraryItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { getLibraryItems } from '../actions';
import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// E-book Reader Component
const EbookReader = ({ content }: { content: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageInput, setPageInput] = useState("");
    const charsPerPage = 1500; // Approximate characters per page
    const { toast } = useToast();

    const pages = useMemo(() => {
        const p = [];
        for (let i = 0; i < content.length; i += charsPerPage) {
            p.push(content.substring(i, i + charsPerPage));
        }
        return p;
    }, [content]);

    const totalPages = pages.length;
    
    useEffect(() => {
        setPageInput((currentPage + 1).toString());
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 2) {
            setCurrentPage(prev => prev + 2);
        } else if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 2);
        } else if (currentPage > 0) {
            setCurrentPage(prev => prev - 1)
        }
    };
    
    const handlePageSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(pageInput, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                // Adjust for 0-based index and ensure we land on an odd page for the left side of the spread
                const targetPage = pageNum % 2 === 0 ? pageNum - 2 : pageNum - 1;
                setCurrentPage(targetPage < 0 ? 0 : targetPage);
            } else {
                toast({
                    variant: 'destructive',
                    title: "Invalid Page Number",
                    description: `Please enter a number between 1 and ${totalPages}.`
                })
            }
        }
    };

    const leftPageContent = pages[currentPage];
    const rightPageContent = currentPage + 1 < totalPages ? pages[currentPage + 1] : '';

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl p-4 bg-muted/20 rounded-lg shadow-inner mt-4 font-serif">
                <div className="flex flex-col md:flex-row gap-8 min-h-[60vh]">
                    {/* Left Page */}
                    <div className="w-full md:w-1/2 p-6 bg-background/50 rounded-lg shadow-md flex flex-col">
                        <p className="text-foreground/90 whitespace-pre-line leading-relaxed flex-grow">
                            {leftPageContent}
                        </p>
                        <span className="text-center text-sm text-muted-foreground mt-4">
                            Page {currentPage + 1}
                        </span>
                    </div>
                    {/* Right Page */}
                     <div className="w-full md:w-1/2 p-6 bg-background/50 rounded-lg shadow-md flex flex-col">
                        <p className="text-foreground/90 whitespace-pre-line leading-relaxed flex-grow">
                           {rightPageContent}
                        </p>
                         {rightPageContent && (
                            <span className="text-center text-sm text-muted-foreground mt-4">
                                Page {currentPage + 2}
                            </span>
                         )}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
                <Button onClick={handlePrevPage} disabled={currentPage === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Input 
                        type="text" 
                        className="w-16 text-center" 
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={handlePageSearch}
                    />
                    <span>/ {totalPages}</span>
                </div>
                <Button onClick={handleNextPage} disabled={currentPage >= totalPages - 2}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


export default function LibraryItemPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);

  useEffect(() => {
    async function fetchItem() {
      const items = await getLibraryItems();
      const foundItem = items.find(p => p.slug === slug);
      setItem(foundItem);
    }
    fetchItem();
  }, [slug]);

  if (item === undefined) {
    // Loading state
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!item) {
    notFound();
  }

  const isSubscribed = true; // Placeholder for premium user

  const getEmbedUrl = (url: string = ''): string => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'drive.google.com') {
            const pathParts = urlObj.pathname.split('/');
            
            const isFolder = pathParts.includes('folders');

            if (isFolder) {
                const folderIdIndex = pathParts.findIndex(part => part === 'folders') + 1;
                const folderId = pathParts[folderIdIndex];
                if (folderId) {
                    return `https://drive.google.com/drive/embed?id=${folderId}`;
                }
            } else {
                 // Handle /file/d/ or /d/
                const fileIdIndex = pathParts.findIndex(part => ['d', 'file'].includes(part));
                let fileId = '';
                if(pathParts[fileIdIndex] === 'file' && pathParts[fileIdIndex+1] === 'd'){
                    fileId = pathParts[fileIdIndex + 2];
                } else if(pathParts[fileIdIndex] === 'd') {
                    fileId = pathParts[fileIdIndex + 1];
                }

                if (fileId) {
                    return `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }
        }
    } catch(e) {
        // Not a valid URL, return original
    }
    return url;
  }

  const renderContent = () => {
    if (item.isPremium && !isSubscribed) {
      return (
        <Card className="bg-muted/30 border-primary/20 text-center p-8 backdrop-blur-sm mt-8">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary w-fit p-3 rounded-full mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary-foreground">This Content is for Subscribers Only</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              To read this {item.category.toLowerCase()}, please subscribe to our premium plan. Unlock all premium content and support our work.
            </p>
            <Link href="/subscribe">
              <Button size="lg">Subscribe Now</Button>
            </Link>
          </CardContent>
        </Card>
      );
    }

    const hasPdf = !!item.pdfUrl;
    const hasText = !!item.content;
    const embeddableUrl = hasPdf ? getEmbedUrl(item.pdfUrl) : '';

    return (
        <Tabs defaultValue={hasPdf ? "document" : "text"} className="w-full mt-8">
            <div className="flex justify-center">
              <TabsList>
                  {hasPdf && <TabsTrigger value="document"><FileText className="mr-2 h-4 w-4"/>Document</TabsTrigger>}
                  {hasText && <TabsTrigger value="text"><BookText className="mr-2 h-4 w-4"/>E-Book Reader</TabsTrigger>}
              </TabsList>
            </div>
            {hasPdf && (
              <TabsContent value="document">
                  <div className="bg-muted/20 p-2 sm:p-4 rounded-lg shadow-inner mt-4">
                    <div className="aspect-[4/5] w-full">
                       <iframe src={embeddableUrl} className="w-full h-full border-0" allow="fullscreen"></iframe>
                    </div>
                  </div>
              </TabsContent>
            )}
            {hasText && (
               <TabsContent value="text">
                  <EbookReader content={item.content!} />
              </TabsContent>
            )}
            {!hasPdf && !hasText && (
                <div className="text-center text-muted-foreground py-16">
                    Content not available for this item.
                </div>
            )}
        </Tabs>
    )
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center text-center gap-4"
        >
            <div className="flex-shrink-0">
                <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={150}
                    height={200}
                    className="rounded-lg shadow-2xl object-cover"
                    data-ai-hint={item.imageAiHint}
                />
            </div>
            <div className="md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground">
                  {item.title}
                </h1>
                <p className="text-xl text-muted-foreground mt-1">{item.author}</p>
                 <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3" /> Premium</Badge>}
                </div>
            </div>
        </motion.div>
        
        <main>
            {renderContent()}
        </main>
      </div>
    </div>
  );
}
