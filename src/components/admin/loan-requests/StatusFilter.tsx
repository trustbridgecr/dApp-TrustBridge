import { Select, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";

interface StatusFilterProps {
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export default function StatusFilter({ statusFilter, setStatusFilter }: StatusFilterProps) {
    return (
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48"> {statusFilter} </SelectTrigger>
            <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
        </Select>
    );
}
2