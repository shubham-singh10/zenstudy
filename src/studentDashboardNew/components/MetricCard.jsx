const MetricCard = ({ title, value, change, icon }) => {
    const isPositive = change.value.startsWith("+")

    return (
        <div className="bg-white rounded-lg p-6 border">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm text-gray-600">{title}</h3>
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-2xl font-semibold">
                    {title === "Total Revenue" && "₹"}
                    {value}
                </p>
                <p className="text-sm text-gray-500">
                    <span className={isPositive ? "text-green-600" : "text-red-600"}>{change.value}%</span> {change.timeframe}
                </p>
            </div>
        </div>
    )
}

export default MetricCard

