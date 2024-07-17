'use client';

import {CardDescription, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Time from "@/components/time";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {useSearchParams} from "next/navigation";
import siteData from "@/blog.config";
import {
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";


const BlogContent = ({posts}: any) => {
    const allPostCount = posts.length || 0
    const searchParams = useSearchParams()
    const currentTag = searchParams.get('tag')

    if (currentTag) {
        posts = posts.filter((post: any) => post.tags.includes(currentTag))
    }

    const page: any = Number(searchParams.get('page')) || 1
    const {blog: {pagination}} = siteData

    // 如果分页开启
    if (pagination?.enabled) {
        if (pagination?.engine === 'default') {
            posts = posts.slice((page - 1) * pagination.pageSize, page * pagination.pageSize)
        }

        if (pagination?.engine === 'loadMore') {
            posts = posts.slice(0, page * pagination.pageSize)
        }
    }

    return (
        <>
            {posts.map((post: any, index: number) => (
                <div className={'space-y-4'} key={index}>
                    <div className={'space-y-4'}>
                        <div className={'block md:hidden'}>
                            <Time date={post.time}/>
                        </div>
                        <CardTitle className={'not-prose'}>
                            <Link className={'underline underline-offset-4'} href={`/blog/${post.id}`}>
                                {post.title}
                            </Link>
                        </CardTitle>
                        <div className={'flex flex-col md:flex-row md:space-x-4'}>
                            <div className={'hidden md:block'}>
                                <Time date={post.time}/>
                            </div>
                            <div className={'space-x-2'}>
                                {post?.tags?.map((tag: string, index: number) => (
                                    <Link href={`/blog?tag=${tag}`}>
                                        <Badge key={index} variant={currentTag == tag ? "default" : "secondary"}>
                                            #{tag}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <CardDescription className={'text-base'}>
                        {post.summary}
                    </CardDescription>
                    <div className={'flex justify-end'}>
                        <Link href={`/blog/${post.id}`}>
                            <Button>
                                Read More <ArrowRight size={16} className={'ml-2'}/>
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
            {(
                pagination?.enabled &&
                <div className={"pt-8"}>
                    {pagination?.engine === 'default' && (
                        <div className={'w-full grid grid-cols-3 justify-items-center items-center'}>
                            <div className={'w-full flex justify-start'}>
                                {page > 1 && (
                                    <PaginationPrevious href={`/blog?page=${page - 1}`}/>
                                )}
                            </div>
                            <div>
                                {page} of {Math.ceil(allPostCount / pagination.pageSize)}
                            </div>
                            <div className={'w-full flex justify-end'}>
                                {page < Math.ceil(allPostCount / pagination.pageSize) && (
                                    <PaginationNext href={`/blog?page=${page + 1}`}/>
                                )}
                            </div>
                        </div>
                    )}
                    {pagination?.engine === 'loadMore' && (
                        (allPostCount > page * pagination.pageSize) &&
                        <Link href={`/blog?page=${page + 1}`}>
                            <Button variant={"outline"} className={'w-full'}>
                                Load More ···
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}


export default BlogContent