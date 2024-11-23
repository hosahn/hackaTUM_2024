declare type ArticleData = {
    metainfo: {
        content: string,
        id: number,
        link: string,
        pubDate: Date,
        source: string,
        title: string,
    },
    category: string,
};

export default ArticleData;