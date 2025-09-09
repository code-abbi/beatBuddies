import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SongsTable = () => {
	const { songs, isLoading, error, deleteSong } = useMusicStore();

	if (error) {
		return <div className='text-red-400 text-center py-8'>{error}</div>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-transparent border-b-border'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
                {isLoading 
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-none">
                            <TableCell><Skeleton className="size-10 rounded" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                    : songs.map((song) => (
                        <TableRow key={song._id} className='hover:bg-muted border-none'>
                            <TableCell>
                                <img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
                            </TableCell>
                            <TableCell className='font-medium text-foreground'>{song.title}</TableCell>
                            <TableCell className="text-muted-foreground">{song.artist}</TableCell>
                            <TableCell>
                                <span className='inline-flex items-center gap-2 text-muted-foreground'>
                                    <Calendar className='h-4 w-4' />
                                    {song.createdAt.split("T")[0]}
                                </span>
                            </TableCell>

                            <TableCell className='text-right'>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                                    onClick={() => deleteSong(song._id)}
                                >
                                    <Trash2 className='size-4' />
                                </Button>
                            </TableCell>
                        </TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default SongsTable;