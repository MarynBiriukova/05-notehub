//fetchNotes();
//createNote();
//deleteNote();

import axios, { type AxiosResponse } from 'axios';
import type {NewNoteData, Note } from '../types/note';


//import type { NewTaskData, Task, UpdatedTaskData } from '../types/task';



const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api'//
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

/*export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}*/

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export const fetchNotes = async (query: string, page: number = 1): Promise<FetchNotesResponse> => {

    const queryParams: Record<string, string> = {
        page: String(page),
        perPage: '12',
    }; 
    
    if (query && query.trim() !== '') {
    queryParams.search = query;
  }

  const options = {
    method: 'GET',
    url: '/notes',
    params: queryParams,
    headers: {
      accept: 'application/json',
      //Authorization: `Bearer ${myKey}`
    }
    };
    
    const response: AxiosResponse<FetchNotesResponse> = await axios.request<FetchNotesResponse>(options);
  
  return response.data;//.results || [];
};

export const deleteNote = async (id: string) => {
  const res = await axios.delete<void>(`/notes/${id}`)
  return res.data
}

export const createNote = async (newNoteData: NewNoteData) => {
  const res = await axios.post<Note>('/notes', newNoteData)
  return res.data
}



