import { useAuction, useTokenMetadata, ActiveAuction } from 'builder-bundle'

const truncateString = (str, len) => {
  return (
    str.substring(0, len) + '...' + str.substring(str.length - len, str.length)
  )
}

/**
 * TODO
 * - way to determine if there was an actual auction or if it was sent to the treasury or the creator
 * - bett loading state, no "invalid date", although not sure that's a problem for the hook library
 * - ENS
 */

export const FlexibleAuctionHooks = () => {
  const tokenId = 48
  const { data } = useAuction(String(tokenId))
  const { token } = useTokenMetadata(String(tokenId))

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 px-4">
      <div>
        <img
          src={token?.image}
          className="my-0 h-96 w-96 rounded border border-4 border-black"
        />
        <div className="mt-[-15px] flex items-center justify-center space-x-2">
          <input
            className="rounded-lg border border-2 border-black px-2 py-1"
            placeholder="Place bid"
          />
          <button className="rounded-lg border border-2 border-black bg-black px-4 py-1 font-bold text-white">
            Bid
          </button>
        </div>
        <div className="flex flex-row items-center justify-center space-x-4">
          <ActiveAuction.Countdown className="font-bold text-black" />
          <span className="font-bold text-black">
            {data?.highestBidPrice} {data?.highestBidCurrency}
          </span>
          <span className="font-bold text-black">
            {truncateString(data?.highestBidder || '', 5)}
          </span>
        </div>
      </div>
    </div>
  )
}
