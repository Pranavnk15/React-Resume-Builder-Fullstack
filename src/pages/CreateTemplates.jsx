import React, { useEffect, useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa6';
import { PuffLoader } from "react-spinners"
import { toast } from "react-toastify";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage, db } from '../config/firebase.config';
import { adminIds, initialTags } from '../utils/helper';
import { serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';
import {useUser} from "../hooks";
import {usenavigate} from "react-router-dom";


export default function CreateTemplates() {

    const [formData, setFormData] = useState({
        title: "",
        imageURL: null,
    });

    const [imageAsset, setImageAsset] = useState({
        isImageLoading: false,
        uri: null,
        progress: 0
    })

    const [selectedTags, setSelectedTags] = useState([]);

    const { data: templates, isError: templatesIsError, isLoading: templateIsLoading, refetch: templatesRefetch } = useTemplates()

    const {data: user, isLoading} = useUser();

    const navigate = usenavigate()

    //handling the input field change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevRec) => ({ ...prevRec, [name]: value }))
    }

    //handle the image file changes
    const handleFileSelect = async (e) => {
        //console.log(file);
        setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
        const file = e.target.files[0];
        if (file && isAllowed(file)) {
            const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    setImageAsset((prevAsset) => ({
                        ...prevAsset,
                        progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    }))
                },
                (error) => {
                    if (error.message.includes("storage/unauthorized")) {
                        toast.error(`Error : Authorization Revoked`)
                    } else {
                        toast.error(`Error : ${error.message}`)
                    }
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            uri: downloadURL,
                        }));
                    });

                    toast.success("Image uploaded");
                    setInterval(() => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            isImageLoading: false
                        }))
                    }, 2000);
                }
            )
        } else {
            toast.info("Invalid file format");
        }
    }

    // action to deltet an image from the cloud
    const deleteAnImageObject = async () => {
        setInterval(() => {
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                progress: 0,
                uri: null,
                isImageLoading: false,
            }));
        }, 2000);
        const deleteRef = ref(storage, imageAsset.uri);
        deleteObject(deleteRef).then(() => {
            toast.success("Image Removed");
        })
    }

    const isAllowed = (file) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
        return allowedTypes.includes(file.type)
    }

    const handleSelectTags = (tag) => {
        //check if the tag is selected or not
        if (selectedTags.includes(tag)) {
            //if selsected tag remove it
            setSelectedTags(selectedTags.filter(selected => selected !== tag))
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const pushToCloud = async () => {
        //create the document type
        const timestamp = serverTimestamp()
        const id = `${Date.now()}`
        const _doc = {
            _id: id,
            title: formData.title,
            imageURL: imageAsset.uri,
            tags: selectedTags,
            name: templates && templates.length > 0 ? `Template${templates.length + 1}` : "Template1",
            timestamp: timestamp,
        }
        // console.log((_doc));

        await setDoc(doc(db, "templates", id), _doc).then(() => {
            setFormData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
            setImageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
            setSelectedTags([]);
            templatesRefetch();
            toast.success("Data pushed to the cloud");
        }).catch(error => {
            toast.error(`Error : ${error.message}`)
        })
    }

    // function to remove data from the cloud
    const removeTemplate = async (template) => {
        const deleteRef = ref(storage, template?.imageURL)
        await deleteObject(deleteRef).then(async() => {
            await deleteDoc(doc(db, "templates", template?._id)).then(() => {
                toast.success("Template deleted from the cloud");
                templatesRefetch();
            }).catch(err => {
                toast.error(`Error : ${err.message}`)
            })
        })
    }

    useEffect(() => {
        if(!isLoading && !adminIds.includes(user?.uid)) {
            navigate("/", {replace: true});
        }
    }, [user, isLoading])

    return (
        <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
            {/* left container  */}
            <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2'>
                <div className='w-full'>
                    <p className='text-lg text-txtPrimary'>Create a new Template</p>
                </div>
                {/* template id section */}
                <div className='w-full flex items-center justify-end'>
                    <p className='text-base text-txtLight uppercase font-semibold'>TempId :{" "}</p>
                    <p className='text-sm text-txtDark capitalize font-bold'>{templates && templates.length > 0 ? `Template${templates.length + 1}` : "Template1"}</p>
                </div>
                {/* template title section */}
                <input
                    className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none'
                    type="text"
                    name='title'
                    placeholder='Template Title'
                    value={formData.title}
                    onChange={handleInputChange}

                />

                {/* file upload section */}
                <div className='w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 curson-pointer flex items-center justify-center'>
                    {imageAsset.isImageLoading ? (
                        <>
                            <div className='flex flex-col items-center justify-center gap-4'>
                                <PuffLoader color="#498FCD" size={40} />
                                <p>{imageAsset.progress.toFixed(2)}%</p>
                            </div>
                        </>
                    ) : (
                        <>
                            {!imageAsset.uri ? (
                                <React.Fragment>
                                    <label className='w-full cursor-pointer h-full'>
                                        <div className="flex flex-col items-center justify-center h-full w-full">
                                            <div className='flex items-center justify-center cursor-pointer flex-col gap-4'>
                                                <FaUpload className='text-2xl ' />
                                                <p className='text-lg text-txtLight'>Click to upload</p>
                                            </div>
                                        </div>
                                        <input type="file" className='w-0 h-0' accept='.jpeg,.jpg,.png' onChange={handleFileSelect} />
                                    </label>
                                </React.Fragment>) : (
                                <React.Fragment>
                                    <div className='relative w-full h-full overflow-hidden rounded-md'>
                                        <img
                                            src={imageAsset.uri}
                                            className='w-full h-full object-cover'
                                            loading='lazy'
                                            alt="" />

                                        {/* delete action */}
                                        <div onClick={deleteAnImageObject} className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer'>
                                            <FaTrash className='text-sm text-white' />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </>
                    )}
                </div>

                {/* tags section */}
                <div className='w-full flex items-center flex-wrap gap-2'>
                    {initialTags.map((tag, i) => (
                        <div key={i} className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""}`} onClick={() => handleSelectTags(tag)}>
                            <p className='text-xs'>{tag}</p>
                        </div>
                    ))}
                </div>

                {/* button action */}
                <button type='button' onClick={pushToCloud} className='w-full bg-blue-700 text-white rounded-md py-3 '>
                    Save
                </button>
            </div>



            {/* right container  */}
            <div className='col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4'>
                {templateIsLoading ? (
                    <>
                        <div className='w-full h-full flex items-center justify-center'>
                            <PuffLoader color='#498FCD' size={40} />
                        </div>
                    </>
                ) : (
                    <>
                        {templates && templates.length > 0 ? (
                            <>
                                <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols04 gap-4'>
                                    {templates.map((template) => (
                                        <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden relative'>
                                            <img src={template?.imageURL} alt="" className='w-full h-full object-cover' />
                                            
                                            {/* delete action */}
                                            <div onClick={() => removeTemplate(template)} className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer'>
                                                <FaTrash className='text-sm text-white' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='w-full h-full flex flex-col gap-6 items-center justify-center'>
                                    <PuffLoader color='#498FCD' size={40} />
                                    <p className='text-xl tracking-wider capitalize text-txtPrimary'>
                                        No data
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
