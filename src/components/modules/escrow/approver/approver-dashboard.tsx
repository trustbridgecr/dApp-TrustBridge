"use client"
import { useApproveEscrow } from "../hooks/escrow-approval.hook"
import { EscrowApprovalCard } from "./escrow-approval-card"
import { ApprovalConfirmationModal } from "./approval-confirmation-modal"
import { Loader2 } from "lucide-react"

export function ApproverDashboard() {
    const {
        escrows,
        loading,
        selectedEscrow,
        selectedMilestoneIndex,
        isModalOpen,
        approvalLoading,
        handleApproveClick,
        refreshEscrows,
        setIsModalOpen,
        setApprovalLoading,
    } = useApproveEscrow()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Escrow Approvals Dashboard</h1>
                <button
                    onClick={refreshEscrows}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : escrows.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted">
                    <p className="text-lg">No escrows pending approval</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {escrows.map((escrow) => (
                        <EscrowApprovalCard key={escrow.id} escrow={escrow} onApprove={handleApproveClick} />
                    ))}
                </div>
            )}

            {selectedEscrow && selectedMilestoneIndex !== null && (
                <ApprovalConfirmationModal
                    escrow={selectedEscrow}
                    milestoneIndex={selectedMilestoneIndex}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onApprovalComplete={refreshEscrows}
                    isLoading={approvalLoading}
                    setIsLoading={setApprovalLoading}
                />
            )}
        </div>
    )
}