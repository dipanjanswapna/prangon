
import { getLibraryItems } from './actions';
import { LibraryForm, DeleteLibraryItemButton } from '@/components/admin/library-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default async function AdminLibraryPage() {
  const items = await getLibraryItems();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Library</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete books, magazines, and comics.
                </p>
            </div>
            <LibraryForm />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Library Items</CardTitle>
                <CardDescription>View and manage all your current library items.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cover</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {items.length > 0 ? (
                            items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image 
                                            src={item.coverImage}
                                            alt={item.title}
                                            width={40}
                                            height={60}
                                            className="rounded-sm object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.author}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {item.isFeatured && <Badge>Featured</Badge>}
                                            {item.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3"/>Premium</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <LibraryForm itemToEdit={item} />
                                            <DeleteLibraryItemButton id={item.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                         ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No items found.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
