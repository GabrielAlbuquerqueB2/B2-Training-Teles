export function approvalAccepted() {
    return (
        {
            "ApprovalRequestDecisions": [
                {
                    "Status": "ardApproved"
                }
            ]
        }
    )
}

export function approvalRejected() {
    return (
        {
            "ApprovalRequestDecisions": [
                {
                    "Status": "ardNotApproved"
                }
            ]
        }
    )
}