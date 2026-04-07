import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Comics } from '.';
import * as userAgent from 'random-useragent';

console.log('v2 API router loaded');

const router = express.Router();

const allStatus = ['all', 'completed', 'ongoing'];

// Async handler wrapper to catch errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Genres
router.get('/genres', asyncHandler(async (req, res) => {
  const data = await Comics.getGenres();
  res.json(data);
}));

router.get('/genres/:slug', asyncHandler(async (req, res) => {
  const { params, query } = req;
  const slug = String(params.slug || '');
  const page = Number(query.page) || 1;
  const status = String(query.status || 'all');
  if (!allStatus.includes(status)) {
    return res.status(400).json({ status: 400, message: 'Invalid status' });
  }
  const data = await Comics.getComicsByGenre(slug, page, status as any);
  res.json(data);
}));

// New Comics
router.get(`/new-comics`, asyncHandler(async (req, res) => {
  const { query } = req;
  const status = (query.status as string) || 'all';
  const page = Number(query.page) || 1;
  if (!allStatus.includes(status)) {
    return res.status(400).json({ status: 400, message: 'Invalid status' });
  }
  const data = await Comics.getNewComics(status as any, page);
  res.json(data);
}));

// Recommend Comics
router.get(`/recommend-comics`, asyncHandler(async (req, res) => {
  const { query } = req;
  const type = (query.type as string) || 'hot';
  const data = await Comics.getRecommendComics(type as any);
  res.json(data);
}));

// Search
const searchApiPaths = [
  {
    path: '/search',
    callback: (q: string, page: number) => Comics.searchComics(q, page),
  },
  {
    path: '/search-suggest',
    callback: (q: string) => Comics.getSearchSuggest(q),
  },
];

searchApiPaths.forEach(({ path, callback }) => {
  router.get(path, asyncHandler(async (req, res) => {
    const { query } = req;
    const q = String(query.q || '');
    if (!q) {
      return res.status(400).json({ status: 400, message: 'Invalid query' });
    }
    const page = Number(query.page) || 1;
    const data = await callback(q, page);
    res.json(data);
  }));
});

// Page params
const pageParamsApiPaths = [
  {
    path: '/boy-comics',
    callback: (...params: any) => Comics.getBoyComics(...params),
  },
  {
    path: '/completed-comics',
    callback: (...params: any) => Comics.getCompletedComics(...params),
  },
  {
    path: '/girl-comics',
    callback: (...params: any) => Comics.getGirlComics(...params),
  },
  {
    path: '/recent-update-comics',
    callback: (...params: any) => Comics.getRecentUpdateComics(...params),
  },
  {
    path: '/trending-comics',
    callback: (...params: any) => Comics.getTrendingComics(...params),
  },
];

pageParamsApiPaths.forEach(({ path, callback }) => {
  router.get(path, asyncHandler(async (req, res) => {
    const { query } = req;
    const page = Number(query.page) || 1;
    const data = await callback(page);
    res.json(data);
  }));
});

// Comics
const comicIdParamsApiPaths = [
  {
    path: '/comics/:slug/chapters',
    callback: (params: string) => Comics.getChapters(params),
  },
  {
    path: '/comics/:slug',
    callback: (params: string) => Comics.getComicDetail(params),
  },
  {
    path: '/comics/authors/:slug',
    callback: (params: string) => Comics.getComicsByAuthor(params),
  },
];

comicIdParamsApiPaths.forEach(({ path, callback }) => {
  router.get(path, asyncHandler(async (req, res) => {
    const { params } = req;
    const slug = String(params.slug || '');
    if (!slug) {
      return res.status(400).json({ status: 400, message: 'Invalid slug' });
    }
    const data = await callback(slug);
    res.json(data);
  }));
});

router.get('/comics/:slug/chapters/:chapter_id', asyncHandler(async (req, res) => {
  const { params } = req;
  const slug = String(params.slug || '');
  const chapter_id = params.chapter_id ? Number(params.chapter_id) : null;
  if (!slug || !chapter_id) {
    return res.status(400).json({ status: 400, message: 'Invalid parameters' });
  }
  const data = await Comics.getChapter(slug, chapter_id);
  res.json(data);
}));

router.get('/comics/:slug/comments', asyncHandler(async (req, res) => {
  const { params, query } = req;
  const slug = String(params.slug || '');
  const page = Number(query.page) || 1;
  if (!slug) {
    return res.status(400).json({ status: 400, message: 'Invalid slug' });
  }
  const data = await Comics.getComments(slug, page);
  res.json(data);
}));

// Top Comics
const topComicsApiPaths = [
  {
    path: '/',
    callback: (...params: any) => Comics.getTopAllComics(...params),
  },
  {
    path: '/weekly',
    callback: (...params: any) => Comics.getTopWeeklyComics(...params),
  },
  {
    path: '/monthly',
    callback: (...params: any) => Comics.getTopMonthlyComics(...params),
  },
  {
    path: '/daily',
    callback: (...params: any) => Comics.getTopDailyComics(...params),
  },
  {
    path: '/chapter',
    callback: (...params: any) => Comics.getTopChapterComics(...params),
  },
  {
    path: '/follow',
    callback: (...params: any) => Comics.getTopFollowComics(...params),
  },
  {
    path: '/comment',
    callback: (...params: any) => Comics.getTopCommentComics(...params),
  },
];

topComicsApiPaths.forEach(({ path, callback }) => {
  router.get(`/top${path}`, asyncHandler(async (req, res) => {
    const { query } = req;
    const status = String(query.status || 'all');
    const page = Number(query.page) || 1;
    const data = await callback(status, page);
    res.json(data);
  }));
});

router.get('/images', asyncHandler(async (req, res) => {
  const { src } = req.query;
  if (!src) {
    return res.status(400).json({ status: 400, message: 'Missing src parameter' });
  }
  try {
    const response = await axios.get(String(src), {
      responseType: 'stream',
      headers: {
        referer: process.env.NETTRUYEN_BASE_URL || 'https://nettruyenar.com/',
        'User-Agent': userAgent.getRandom(),
      },
      timeout: 15000,
    });
    response.data.pipe(res);
  } catch (err: any) {
    console.error('Images proxy error:', err.message);
    res.status(502).json({ status: 502, message: 'Failed to fetch image' });
  }
}));

export default router;
