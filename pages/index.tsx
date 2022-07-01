import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-300 to-blue-300 p-2">
      {/* HEADER SECTION - inject html into the header */}
      <Head>
        <title>Sengh NFT</title>
        <link rel="icon" href="/" />
      </Head>
      {/* HEADER SECTIONS ENDS HERE */}

      <h1 className="text-center text-5xl font-thin text-white">
        The
        <span className="font-extrabold underline decoration-blue-300/50">
          {' '}
          Sengh{' '}
        </span>
        NFT is here
      </h1>
      <main className="mt-10 p-10 shadow-2xl shadow-blue-300">
        <div>
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex cursor-pointer flex-col items-center transition-all duration-500 ease-in-out hover:scale-90">
                <img
                  className="mt-10 h-60 rounded-3xl object-cover"
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />

                <div className="mt-5">
                  <h2 className="text-2xl font-extralight text-white">
                    {collection.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  // query tested in Sanity c,s
  const query = `*[_type == "collection"]{
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

  const collections = await sanityClient.fetch(query)
  return {
    props: {
      collections,
    },
  }
}
