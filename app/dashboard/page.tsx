
//sample page to protect routes if user is logged out in middleware.ts
//this page should only be accessible if user is logged in
export default function DashboardPage() {
    return (
        <div>private dashboard page - you need to be logged in to view this</div>
    )
}