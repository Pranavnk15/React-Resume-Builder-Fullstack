import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getTemplateDetails, saveToCollections, saveToFavourites } from '../api';
import MainSpinner from '../components/MainSpinner';
import { FaHouse } from 'react-icons/fa6';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplates from '../hooks/useTemplates';
import { AnimatePresence } from 'framer-motion';
import TemplateDesignPin from '../components/TemplateDesignPin';



export default function TemplateDesignPinDetails() {

  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: templates, refetch: temp_refetch, isLoading: temp_isLoading } = useTemplates();

  const addToCollection = async (e) => {
    //it not allow the user to redirect to new page
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  }

  const addToFav = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
    refetch();
  }

  const { data: user, refetch: userRefetch } = useUser();

  if (isLoading) return <MainSpinner />;

  if (isError) {
    return (
      <div className='w-full h-[60vh] flex flex-col items-center justify-center'>
        <p className='text-lg text-txtPrimary font-semibold'>Error while fetching the data... Please try again later</p>
      </div>
    )
  }

  return (
    <div className='w-full flex items-center justify-center flex-col px-4 py-12'>
      {/* bread crum */}
      <div className='w-full flex items-center pb-8 gap-2'>
        <Link
          to={"/"}
          className='flex items-center justify-center gap-2 text-txtPrimary'
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* design main section layout */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-12'>
        {/* left section */}
        <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
          {/* load the templte img */}
          <img className='w-full h-auto object-contain rounded-md' src={data?.imageURL} alt="" />

          {/* title and other options */}
          <div className='w-full flex flex-col items-start justify-start gap-2'>
            {/* title sction */}
            <div className='w-full flex items-center justify-between'>
              <p className='text-base text-txtPrimary font-semibold'>
                {data?.title}
              </p>
              {/* likes section */}
              {data?.favourites?.length > 0 && (
                <div className='flex items-center justify-center gap-1'>
                  <BiSolidHeart className='text-base text-red-500' />
                  <p className='text-base text-txtPrimary font-semibold'>
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* collections favourite options */}
          {user && (
            <div className='flex items-center justify-center gap-3'>
              {user?.collections?.includes(data?._id) ? (
                <>
                  <div
                    onClick={addToCollection}
                    className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                    <BiSolidFolderPlus className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Collections</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={addToCollection}
                    className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                    <BiFolderPlus className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Collections</p>
                  </div>
                </>
              )}
            </div>
          )}


          {user && (
            <div className='flex items-center justify-center gap-3'>
              {data?.favourites?.includes(user?.uid) ? (
                <>
                  <div
                    onClick={addToFav}
                    className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                    <BiSolidHeart className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Remove From Favourites</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={addToFav}
                    className='flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'>
                    <BiHeart className='text-base text-txtPrimary' />
                    <p className='text-sm text-txtPrimary whitespace-nowrap'>Add To Favourites</p>
                  </div>
                </>
              )}
            </div>
          )}







        </div>

        {/* right section */}
        <div className='col-span-1 lg:col-span-4 w-full flex-col items-center justify-start px-3 gap-6'>
          {/* discover more */}
          <div
            className='w-full h-72 bg-blue-200 rounded-md overflow-hidden relative'
            style={{
              background: "url(https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className='absolute inset-0 flex items-center justify-center bg-[rgbs(0, 0, 0, 0.4)]'>
              <Link to={"/"} className='px-4 py-2 rounded-md border-2 border-gray-50 text-white'>
                Discover More
              </Link>

            </div>

          </div>

          {/* edit the template */}
          {/* localhost:3000/resume/professional/123453 */}
          {user && (
            <Link className='w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500' to={`/resume/${data?.name}?.templateId=${templateID}`} >
              <p className='text-white font-semibold text-lg'>Edit this Template</p>
            </Link>
          )}

          {/* tags */}
          <div className='w-full flex items-center justify-start flex-wrap gap-2'>
            {data?.tags?.map((tag, index) => (
              <p
                className='text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap'
                key={index}
              >
                {tag}
              </p>
            ))}

          </div>
        </div>
      </div>

      {/* similar templates */}
      {templates?.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className='w-full py-8 flex flex-col items-start justify-start gap-4'>
          <p className='text-lg font-semibold text-txtDark'>
            You might also like
          </p>

          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
            <>
              <AnimatePresence>
                {templates?.filter((temp) => temp._id !== data?._id).map((template, index) => (
                  <TemplateDesignPin
                    key={template?._id}
                    data={template}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </>

          </div>
        </div>
      )}
    </div>
  )
}
