import { ethers, BigNumber } from 'ethers'
import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useProposals, useProposedTransaction } from 'builder-bundle'

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

const proposalStateColorMap = {
  Pending: 'bg-yellow-100 text-yellow-500',
  Active: 'bg-green-100 text-green-500',
  Cancelled: 'bg-gray-100 text-gray-500',
  Defeated: 'bg-red-100 text-red-500',
  Succeeded: 'bg-blue-100 text-blue-500',
  Queued: 'bg-blue-100 text-blue-500',
  Expired: 'bg-red-100 text-red-500',
  Executed: 'bg-blue-100 text-blue-500',
  Vetoed: 'bg-red-100 text-red-500',
}

const ProposedTransaction = ({ id, target, calldata, value }) => {
  const valueBN = BigNumber.from(value)
  const { data, error } = useProposedTransaction(target, calldata)

  return (
    <div>
      <div className="flex flex-col">
        <a href="#" className="text-gray-700 underline">
          {id + 1}. {target}
        </a>
        <span className="ml-4">{`.${data?.functionName || 'transfer'}(`}</span>
      </div>
      {!data?.decoded && !valueBN.isZero() && (
        <div className="ml-4">{`${ethers.utils.formatEther(valueBN)} ETH`}</div>
      )}
      {data?.decoded?.map((decoded, idx) => (
        <div className="ml-4" key={idx}>
          {decoded}
        </div>
      ))}
      <div>)</div>
    </div>
  )
}

export const NounsBuildProposalsHooks = () => {
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState()
  const { data } = useProposals()

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 px-4 py-8">
      <Transition appear show={isProposalDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsProposalDialogOpen(false)}
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
                <Dialog.Panel className="w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-gray-900"
                  >
                    {selectedProposal?.title}
                  </Dialog.Title>
                  <section className="mt-12 grid grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-2 rounded-lg border p-4">
                      <h4 className="font-bold">For</h4>
                      <span className="text-xl text-green-600">
                        {selectedProposal?.forVotes}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2 rounded-lg border p-4">
                      <h4 className="font-bold">Against</h4>
                      <span className="text-xl text-gray-500">
                        {selectedProposal?.againstVotes}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2 rounded-lg border p-4">
                      <h4 className="font-bold">Abstain</h4>
                      <span className="text-xl text-gray-500">
                        {selectedProposal?.abstainVotes}
                      </span>
                    </div>
                  </section>
                  <section className="mt-8">
                    <h3 className="mb-4 text-lg font-bold">Description</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedProposal?.description ?? '',
                      }}
                    ></div>
                  </section>
                  <section className="mt-8">
                    <h3 className="mb-4 text-lg font-bold">Proposer</h3>
                    <p>{truncateString(selectedProposal?.author ?? '', 5)}</p>
                  </section>
                  <section className="mt-8">
                    <h3 className="mb-4 text-lg font-bold">
                      Proposed Transactions
                    </h3>
                    {selectedProposal?.targets?.map((target, idx) => {
                      return (
                        <ProposedTransaction
                          id={idx}
                          target={target}
                          value={selectedProposal?.values[idx]}
                          calldata={selectedProposal?.calldatas[idx]}
                        />
                      )
                    })}
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="w-[1000px] rounded border bg-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-black">Proposals</h1>
        <div className="mt-4 space-y-4">
          {data?.map((proposal) => {
            return (
              <div
                className="flex cursor-pointer flex-row justify-between rounded-lg border p-4"
                onClick={() => {
                  setSelectedProposal(proposal)
                  setIsProposalDialogOpen(true)
                }}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-black">{proposal.title}</span>
                  <span className="mt-1 text-sm font-light text-black opacity-[.39]">
                    {unixTimestampToDate(proposal.createdAt)}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <span
                    className={`${
                      proposalStateColorMap[proposal.state]
                    } rounded-lg py-1 px-2 text-sm`}
                  >
                    {proposal.state}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
