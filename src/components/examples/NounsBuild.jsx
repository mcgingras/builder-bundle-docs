import { BuilderProvider, ActiveAuction } from 'builder-bundle'

const BUILDER_COLLECTION_ADDRESS = '0xdf9b7d26c8fc806b1ae6273684556761ff02d422'
const BUILDER_AUCTION_ADDRESS = '0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d'
const BUILDER_GOVERNER_ADDRESS = '0xe3f8d5488c69d18abda42fca10c177d7c19e8b1a'

export const NounsBuild = () => {
  return (
    <BuilderProvider
      collectionAddress={BUILDER_COLLECTION_ADDRESS}
      auctionAddress={BUILDER_AUCTION_ADDRESS}
      governerAddress={BUILDER_GOVERNER_ADDRESS}
    >
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 px-4">
        <div className="grid gap-6 rounded border bg-white px-6 py-6 shadow-lg md:grid-cols-2">
          <ActiveAuction className="my-0 h-96 w-96 rounded" />
          <div className="space-y-8">
            <ActiveAuction.Title className="text-3xl font-bold" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-400">Current bid</label>
                <ActiveAuction.Price className="text-xl" />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400">Auction ends in</label>
                <ActiveAuction.Countdown className="not-prose text-xl" />
              </div>
            </div>
            <ActiveAuction.ActiveBids>
              {(bids) => (
                <>
                  {bids?.map((bid) => {
                    return (
                      <div className="flex flex-row justify-between">
                        <span className="font-bold">{bid.bidder}</span>
                        <span className="text-gray-400">{bid.amount} ETH</span>
                      </div>
                    )
                  })}
                </>
              )}
            </ActiveAuction.ActiveBids>
          </div>
        </div>
      </div>
    </BuilderProvider>
  )
}
