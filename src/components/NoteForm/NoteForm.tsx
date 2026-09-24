//import React, { useState, useId} from 'react';
import css from './NoteForm.module.css'
//import ReactDOM from 'react-dom';
import { Formik, Field, Form , ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface NoteFormProps {
    handleCreate: (title: string, content: string, tag: string) => void;
    isLoading: boolean;
    onClose: () => void;
}

interface FormValues {
    title: string;
    content: string;
    tag: string;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters!")
    .max(50, "Title is too long!")
        .required("Title is required!"),
  content: Yup.string()
    .min(7, "Content is too short!")
    .required("Content is required!"),  
  tag: Yup.string()
    .required("Tag is required!"),
});

export default function NoteForm({ handleCreate, isLoading, onClose }: NoteFormProps) {
    //const fieldId = useId();
    //const [title, setTitle] = useState('');
    //const [content, setContent] = useState('');
    //const [tag, setTag] = useState('Todo');

    const initialValues: FormValues = {
        title: '',
        content: '',
        tag: 'Todo',
    };

    const handleSubmit = (values: FormValues, {resetForm}: {resetForm: () => void}) => {
        handleCreate(values.title, values.content, values.tag);
        resetForm();

        //if (!title.trim() || !content.trim()) return;
        //handleCreate(title, content, tag);
    };


    return (
   /*********************************************************** */  
   <Formik 
   initialValues={initialValues}
   validationSchema={NoteSchema}
   onSubmit={handleSubmit}>
            <Form className={css.form}>
                
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
                <Field
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                />
    <ErrorMessage name="title" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
                    <Field
                        
      id="content"
      name="content"
                        as="textarea"
                        rows={8}
                    className={css.textarea}
    />
    <ErrorMessage name="content" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
                    <Field
                    as = "select"
                    id="tag"
                    name="tag"
                    className={css.select}
                >
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" component="span" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
                    type="submit"
                    className={css.submitButton}
                    disabled={isLoading}
    >
      Create note
    </button>
  </div>
        </Form>
       </Formik> 

  )
}