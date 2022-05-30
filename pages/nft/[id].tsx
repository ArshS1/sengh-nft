import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'

interface Props {
  collection: Collection
}

function SenghDropPage({ collection }: Props) {
  // authorization
  const connectMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* LEFT SIDE */}
      <div className="flex flex-1 flex-col bg-white bg-slate-100/10 p-40 lg:col-span-6">
        {/* TOP HEADER STARTS */}
        <header className="flex items-center justify-between ">
          <Link href={`/`}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              Market for
              <span className="font-extrabold underline decoration-blue-300/50">
                {' '}
                SENGH{' '}
              </span>{' '}
              NFT
            </h1>
          </Link>
          {/* use ternary operator to hardcode the sign in/out condition */}
          <button
            onClick={() => (address ? disconnect() : connectMetamask())}
            className="rounded-full bg-blue-300 px-4 text-xs text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-4 border-2" />
        {/* TOP HEADER ENDS */}

        {/* INFORMATION ABOUT NFT STARTS */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-60"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="lg:text-extrabold text-3xl font-bold lg:text-5xl">
            The first SENGH drop
          </h1>
          <p className="pt-2 text-xl text-orange-300">0/60 NFT'S CLAIMED</p>
        </div>
        {/* INFORMATION ABOUT NFT ENDS */}

        {/* MINTING STARTS */}
        <button className="h-16 w-full rounded-full bg-orange-300/80 font-extrabold text-white ">
          <span className="text-2xl">Mint NFT (0.01 ETH)</span>{' '}
          {address && (
            <p className="text-white-300 text-center text-xs">
              Logged in with wallet ...{address.substring(address.length - 6)}
            </p>
          )}
        </button>
        {/* MINTING ENDS */}
      </div>
      {/* LEFT SIDE ENDS */}

      {/* RIGHT SIDE STARTS */}
      <div className="bg-gradient-to-br from-blue-300 to-orange-300 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-orange-300 to-blue-300 p-2">
            <img
              className="w-44 rounded-xl border-4 border-double border-white object-cover lg:h-96 lg:w-96"
              src={urlFor(collection.previewImage).url()}
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-center text-4xl font-bold text-white">
              {collection.title.toUpperCase()}
            </h1>
            <h2 className="text-center text-xl text-gray-200">
              {collection.description}
            </h2>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE ENDS */}
    </div>
  )
}

export default SenghDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id, 
    title,
    address, 
    description,
    nftCollectionName,
    mainImage {
        asset
    },
    previewImage {
        asset
    },
    slug {
        current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
          current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
