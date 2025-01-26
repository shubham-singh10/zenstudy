const RecentSales = () => {
    const sales = [
        {
            initials: "OM",
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: 1999.0,
        },
        {
            initials: "JL",
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: 39.0,
        },
        {
            initials: "IN",
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            amount: 299.0,
        },
        {
            initials: "WK",
            name: "William Kim",
            email: "will@email.com",
            amount: 99.0,
        },
        {
            initials: "SD",
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
            amount: 39.0,
        },
    ]

    return (
        <div className="bg-white rounded-lg p-6 border">
            <h2 className="font-semibold mb-4">Recent Sales</h2>
            <p className="text-sm text-gray-500 mb-6">You made 265 sales this month.</p>
            <div className="space-y-6">
                {sales.map((sale) => (
                    <div key={sale.email} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                                {sale.initials}
                            </div>
                            <div>
                                <p className="font-medium">{sale.name}</p>
                                <p className="text-sm text-gray-500">{sale.email}</p>
                            </div>
                        </div>
                        <p className="font-medium">+${sale.amount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentSales

