import { Request, Response } from 'express';

export async function getBooks(req: Request, res: Response) {
  try {
    const search =
      typeof req.query.q === 'string'
        ? req.query.q
        : 'sexual harassment prevention consent';

    const params = new URLSearchParams({
      q: search,
      maxResults: '20',
      printType: 'books',
      orderBy: 'relevance',
      key: process.env.GOOGLE_BOOKS_API_KEY ?? '',
    });

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params}`,
    );

    if (!response.ok) {
      throw new Error('Google Books API gagal diakses');
    }

    const data = await response.json();

    const books = (data.items ?? []).map((item: any) => {
      const info = item.volumeInfo;

      return {
        id: item.id,
        title: info.title,
        authors: info.authors ?? ['Penulis tidak diketahui'],
        description: info.description ?? null,
        thumbnail:
          info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
        publishedDate: info.publishedDate ?? null,
        categories: info.categories ?? [],
        previewLink: info.previewLink ?? null,
        infoLink: info.infoLink ?? null,
      };
    });

    res.json({ books });
  } catch (error) {
    res.status(502).json({
      message: 'Gagal mengambil koleksi buku',
    });
  }
}