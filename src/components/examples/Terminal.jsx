import { BuilderProvider, ActiveAuction } from 'builder-bundle'

const BUILDER_COLLECTION_ADDRESS = '0xdf9b7d26c8fc806b1ae6273684556761ff02d422'
const BUILDER_AUCTION_ADDRESS = '0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d'
const BUILDER_GOVERNOR_ADDRESS = '0xe3f8d5488c69d18abda42fca10c177d7c19e8b1a'

export const Terminal = () => {
  return (
    <BuilderProvider
      collectionAddress={BUILDER_COLLECTION_ADDRESS}
      auctionAddress={BUILDER_AUCTION_ADDRESS}
      governorAddress={BUILDER_GOVERNOR_ADDRESS}
    >
      <div className="not-prose h-screen w-screen bg-black">
        <div className="border-b border-gray-500 p-4">
          <h1 className="text-mono font-mono text-xl font-bold uppercase text-[#ffb700]">
            Builder.sh
          </h1>
        </div>
        <div className="flex flex-row items-center space-x-8 border-b border-gray-500 py-4 px-4">
          <ActiveAuction className="h-12 w-12" />
          <span className="flex flex-col justify-between">
            <label className="font-mono text-sm font-bold uppercase tracking-wider text-[#999]">
              Title
            </label>
            <ActiveAuction.Title className="font-mono text-lg font-bold text-[#ffb700]" />
          </span>
          <span className="flex flex-col justify-between">
            <label className="font-mono text-sm font-bold uppercase tracking-wider text-[#999]">
              Current bid
            </label>
            <ActiveAuction.Price className="font-mono text-lg font-bold text-white" />
          </span>
          <span className="flex flex-col justify-between">
            <label className="font-mono text-sm font-bold uppercase tracking-wider text-[#999]">
              Ends in
            </label>
            <ActiveAuction.Countdown className="font-mono text-lg font-bold text-white" />
          </span>
        </div>
        <table className="mx-auto mt-4 w-[98%]">
          <tbody>
            <tr className="border-b border-gray-500">
              <th className="p-2 text-left font-mono text-xs font-bold uppercase text-[#999]">
                Bidder
              </th>
              <th className="p-2 text-left font-mono text-xs font-bold uppercase text-[#999]">
                Bid
              </th>

              <th className="p-2 text-left font-mono text-xs font-bold uppercase text-[#999]">
                When
              </th>
            </tr>
            <ActiveAuction.ActiveBids>
              {(bids) => (
                <>
                  {bids?.map((bid, idx) => {
                    return (
                      <tr className="border-b border-gray-500" key={idx}>
                        <td className="px-2 py-1 text-left font-mono text-xs font-bold uppercase text-white">
                          {bid.bidder}
                        </td>
                        <td className="px-2 py-1 text-left font-mono text-xs font-bold uppercase text-white">
                          {bid.amount} ETH
                        </td>
                        <td className="px-2 py-1 text-left font-mono text-xs font-bold uppercase text-white">
                          Date TBD
                        </td>
                      </tr>
                    )
                  })}
                </>
              )}
            </ActiveAuction.ActiveBids>
          </tbody>
        </table>
      </div>
    </BuilderProvider>
  )
}
