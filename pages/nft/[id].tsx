import React, { useState, useEffect } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, {Toaster} from 'react-hot-toast'

interface Props {
  collection: Collection
}

function SenghDropPage({ collection }: Props) {
  // get information / set state
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [price, setPrice] = useState<string>('...')

  // pass in the collection id to fetch it's supply data
  const nftDrop = useNFTDrop(collection.address)

  // loading
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // empty return if no change
    if (!nftDrop) return

    const fetchData = async () => {
      setLoading(true)
      const price = await nftDrop.claimConditions.getAll()
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setPrice(price?.[0].currencyMetadata.displayValue)

      setLoading(false)
    }
    fetchData()
  }, [nftDrop])

  const minting = () => {
    if (!nftDrop || !address) return

    const quant = 1

    setLoading(true)

    const notification = toast.loading("Minting...", {
      style: {
        background: "white",
        color: "lightblue", 
        fontWeight: "bolder",
        fontSize: "20px",
        padding: "20px"
      }
    })

    nftDrop
      .claimTo(address, quant)
      .then(async (transaction) => {
        toast("Minting Successful!", {
          duration: 8000,
          style: {
            background: "green",
            color: "white", 
            fontWeight: "bolder",
            fontSize: "20px",
            padding: "20px"
          }
        })
      })
      .catch((err) => {
        toast("Minting Failed!", {
          duration: 8000,
          style: {
            background: "red",
            color: "white", 
            fontWeight: "bolder",
            fontSize: "20px",
            padding: "20px"
          }
        })      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  // authorization
  const connectMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position='top-center'/>

      {/* LEFT SIDE */}
      <div className="flex flex-1 flex-col bg-white bg-slate-100/10 sm:p-20 lg:col-span-6 lg:p-40">
        {/* TOP HEADER STARTS */}
        <header className="flex items-center justify-between">
          <Link href={`/`}>
            <h1 className="w-52 cursor-pointer text-sm font-extralight lg:text-2xl">
              Market for
              <span className="font-extrabold underline decoration-blue-300/50">
                SENGH{' '}
              </span>
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
        <hr className="my-4 border-2 " />
        {/* TOP HEADER ENDS */}

        {/* INFORMATION ABOUT NFT STARTS */}
        <div className="flex flex-1 flex-col items-center space-y-6 text-center sm:mt-5 lg:mt-10 lg:justify-center lg:space-y-0">
          <img
            className="object-cover pb-10 sm:h-40 sm:w-60 lg:h-60 lg:w-80"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="lg:text-extrabold text-2xl font-bold lg:text-5xl">
            The first SENGH drop
          </h1>

          {loading ? (
            <p className="animate-pulse pt-2 text-blue-300 sm:text-xs lg:text-xl">
              Loading supply...
            </p>
          ) : (
            <p className="pt-2 text-orange-300 sm:text-xs lg:text-xl">
              {claimedSupply} / {totalSupply?.toString()} NFT'S CLAIMED
            </p>
          )}

          {loading && (
            <img
              className="h-60 w-60 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            ></img>
          )}
        </div>
        {/* INFORMATION ABOUT NFT ENDS */}

        {/* MINTING STARTS */}
        <button
          onClick={minting}
          className="rounded-full bg-orange-300/80 font-extrabold text-white disabled:bg-gray-400 sm:w-1/2 lg:h-16 lg:w-full"
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Sign in to Mint NFT</>
          ) : (
            <div>
              <div>
                <span className="sm:text-sm lg:text-2xl">
                  Mint NFT ({price} ETH)
                </span>
                {address && (
                  <p className="text-white-300 text-center text-xs">
                    Logged in with wallet ...
                    {address.substring(address.length - 6)}
                  </p>
                )}
              </div>
            </div>
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
