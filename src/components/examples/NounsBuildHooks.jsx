import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  useBidsForTokenId,
  useAuction,
  useTokenMetadata,
  ActiveAuction,
} from 'builder-bundle'

const truncateString = (str, len) => {
  return (
    str.substring(0, len) + '...' + str.substring(str.length - len, str.length)
  )
}

const unixTimestampToDate = (unixTimestamp) => {
  var date = new Date(unixTimestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

/**
 * TODO
 * - way to determine if there was an actual auction or if it was sent to the treasury or the creator
 * - bett loading state, no "invalid date", although not sure that's a problem for the hook library
 * - ENS
 */

export const NounsBuildHooks = () => {
  const [tokenId, setTokenId] = useState(1)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)

  const { data } = useAuction(String(tokenId))
  const { token } = useTokenMetadata(String(tokenId))
  const { bids } = useBidsForTokenId(String(tokenId))

  console.log('bids', bids)

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 px-4">
      <>
        <Transition appear show={isBidDialogOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsBidDialogOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Bid History
                    </Dialog.Title>
                    <div className="divide-y-1 mt-4 space-y-4">
                      {bids?.length > 0 ? (
                        bids?.map((bid) => {
                          return (
                            <div className="flex flex-row justify-between">
                              <span className="font-bold">{bid.bidder}</span>
                              <a
                                href={`https://etherscan.io/tx/${bid?.transactionHash}`}
                                className="flex flex-row items-center space-x-2"
                              >
                                <span className="font-light text-black opacity-[.39]">
                                  {bid.amount} ETH
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  className="h-4 w-4 stroke-gray-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                  />
                                </svg>
                              </a>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-center font-semibold">No bids</p>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
      <div className="grid gap-6 rounded border bg-white p-4 shadow-lg md:grid-cols-2">
        <img src={token?.image} className="h-96 w-96 rounded" />
        <div className="space-y-8">
          <div>
            <div className="mb-2 flex flex-row items-center space-x-2">
              <button
                className="rounded-full border px-2 py-1 text-sm"
                onClick={() => {
                  setTokenId(tokenId - 1)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  className="h-4 w-4 stroke-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <button
                className="rounded-full border px-2 py-1 text-sm"
                onClick={() => {
                  setTokenId(tokenId + 1)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  className="h-4 w-4 stroke-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
              <span className="text-sm font-light text-black opacity-[.39]">
                {data?.startTime && unixTimestampToDate(data?.startTime)}
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-black">{token?.name}</h1>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-light text-black opacity-[.39]">
                {data?.status === 'ACTIVE' ? 'Current bid' : 'Winning bid'}
              </label>
              <h3 className="mt-1 text-2xl font-semibold text-black">
                {data?.highestBidPrice} {data?.highestBidCurrency}
              </h3>
            </div>
            <div className="flex flex-col">
              {data?.status === 'ACTIVE' ? (
                <>
                  <label className="text-sm font-light text-black opacity-[.39]">
                    Highest bidder
                  </label>
                  <ActiveAuction.Countdown className="mt-1 text-2xl font-semibold text-black" />
                </>
              ) : (
                <>
                  <label className="text-sm font-light text-black opacity-[.39]">
                    Held by
                  </label>
                  <h3 className="mt-1 text-2xl font-semibold text-black">
                    {truncateString(data?.winner || '', 5)}
                  </h3>
                </>
              )}
            </div>
          </div>
          <div
            className="rounded-xl bg-gray-100 p-3 text-center font-semibold"
            onClick={() => {
              setIsBidDialogOpen(true)
            }}
          >
            Bid History
          </div>
        </div>
      </div>
    </div>
  )
}
