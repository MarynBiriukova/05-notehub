import { useDebouncedCallback } from 'use-debounce'
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react'
import css from './App.module.css'
import NoteList from '../NoteList/NoteList.tsx';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


import { fetchNotes, deleteNote , createNote } from '../../services/noteService';
import type {NewNoteData} from '../../types/note';// Note , 
import { Toaster, toast } from 'react-hot-toast';

const toastConfig = {
  style: {
    borderRadius: '10px',
    background: '#fff',
    color: '#000',
  },
};

function App() {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => setIsModalOpen(false)


  /*********************************************************** */
  const queryClient = useQueryClient();

  /*********************************************************** */


  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: async () => {
      const res = await fetchNotes(query, currentPage);
      // if (!res?.results?.length) {
      // toast.error('No movies found for your request.', { ...toastConfig });
      //}

      return res;
    },

    //enabled: !!query.trim(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data && data.notes && data.notes.length === 0 && query.trim() !== '') {
      toast.error('No notes found for your request.', { ...toastConfig });
    }
  }, [isSuccess, data, query]);

  const debouncedSetQuery = useDebouncedCallback((text: string) => {
    setQuery(text);
    setCurrentPage(1);
  }, 1000);

  const handleSearch = (text: string) => {
    if (text.includes('!')) return;
    setInputValue(text);
    debouncedSetQuery(text);
  };
 /* const handleSearch = useDebouncedCallback((text: string) => {
    if (text.includes('!')) return;
    setQuery(text);
    setCurrentPage(1);
  }, 1000);*/

  /********************************************************** */

   const mutation = useMutation({
    mutationFn: (newNoteData: NewNoteData) => createNote(newNoteData),
    onSuccess: () => {
      // console.log('onSuccess')
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
      closeModal()
    },
    onError: () => {
      // toast.error()
    },
  })

  const handleCreateMutation = (title: string, content: string, tag: string) => {
    mutation.mutate({
      title,
      content,
      tag
    })
  }

/********************************************************** */
const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
      // toast.success('Deleted...')
    },
    onError: () => {
      // toast.error()
    },
  })

  const handleDeleteMutation = (id: string) => {
    deleteNoteMutation.mutate(id)
  }

/********************************************************** */

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox value={inputValue} onSearch={handleSearch} />

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {/* Пагінація */}
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {/* Кнопка створення нотатки */}
        <button className={css.button} onClick={openModal}>Create note +</button>

      </header>
       {isSuccess && data && data.notes && data.notes.length > 0 && ( 
      <NoteList
        notes={data?.notes || []}
        handleDelete={handleDeleteMutation}

      />
)}
{isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm handleCreate={handleCreateMutation} isLoading={mutation.isPending} onClose={closeModal} />
        </Modal>
      )}

    </div>

  )
}

export default App

