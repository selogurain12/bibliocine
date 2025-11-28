import axios, { AxiosError } from "axios";
import { Injectable } from "@nestjs/common";
import type { ListResult } from "../../../packages/src/dtos/list-result.dto";
import type {
  ReturnApiBookDto,
  ReturnApiErrorDto,
} from "../../../packages/src/dtos/book.dto";
import { Book } from "./book.entity";

@Injectable()
export class BookService {
  async searchbook(q: string): Promise<ListResult<Book>> {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40`;
    const response = await axios.get<{ items: ReturnApiBookDto[] }>(apiUrl);

    const books: Book[] = response.data.items.map((item: ReturnApiBookDto) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors ?? [],
      publisher: item.volumeInfo.publisher ?? "Unknown publisher",
      imageLink: item.volumeInfo.imageLinks?.thumbnail ?? null,
      publisherDate: item.volumeInfo.publishedDate ?? null,
      description: item.volumeInfo.description ?? "",
      industryIdentifierstype: item.volumeInfo.industryIdentifiers?.[0]?.type ?? null,
      industryIdentifieridentyfier: item.volumeInfo.industryIdentifiers?.[0]?.identifier ?? null,
      pageCount: item.volumeInfo.pageCount ?? 0,
      categories: item.volumeInfo.categories ?? [],
      retailPriceamount: item.saleInfo?.retailPrice?.amount ?? undefined,
      retailPricecurrencyCode: item.saleInfo?.retailPrice?.currencyCode ?? undefined,
      retailPricebuyLink: item.saleInfo?.buyLink ?? undefined,
    }));

    return {
      data: books,
      total: books.length,
    };
  }

  async getBook(id: string): Promise<Book> {
    try {
      const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}`;
      const response = await axios.get<ReturnApiBookDto>(apiUrl);

      const item = response.data;

      const book: Book = {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors ?? [],
        publisher: item.volumeInfo.publisher ?? "Unknown publisher",
        imageLink: item.volumeInfo.imageLinks?.thumbnail ?? null,
        publisherDate: item.volumeInfo.publishedDate ?? null,
        description: item.volumeInfo.description ?? "",
        industryIdentifierstype: item.volumeInfo.industryIdentifiers?.[0]?.type ?? null,
        industryIdentifieridentyfier: item.volumeInfo.industryIdentifiers?.[0]?.identifier ?? null,
        pageCount: item.volumeInfo.pageCount ?? 0,
        categories: item.volumeInfo.categories ?? [],
        retailPriceamount: item.saleInfo?.retailPrice?.amount ?? undefined,
        retailPricecurrencyCode: item.saleInfo?.retailPrice?.currencyCode ?? undefined,
        retailPricebuyLink: item.saleInfo?.buyLink ?? undefined,
      };


      return book;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ReturnApiErrorDto>;
        const status = apiError.response?.status;
        const apiMessage = apiError.response?.data.error.message;

        switch (status) {
          case 404:
            throw new Error(`Livre introuvable (id: ${id})`);
          case 503:
            throw new Error("Service Google Books indisponible");
          default:
            throw new Error(apiMessage ?? "Erreur API Google Books");
        }
      }
      throw error;
    }
  }
}
