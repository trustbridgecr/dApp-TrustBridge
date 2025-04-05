"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DollarSign,
  User,
  Search,
  X,
  Filter,
  ArrowUpDown,
  Calendar,
  Milestone,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getApprovedLoanOffers } from "../../server/marketplace.firebase";
import MarketplaceLoanDetailDialog from "../dialogs/MarketplaceLoanDetailDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketplaceOffersList() {
  const [loanOffers, setLoanOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [searchTitle, setSearchTitle] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [sortByRecent, setSortByRecent] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const res = await getApprovedLoanOffers();
      if (res.success && res.data) setLoanOffers(res.data);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return "Unknown address";
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const formatDate = (seconds: number) => {
    if (!seconds) return "Unknown date";
    return format(new Date(seconds * 1000), "dd MMM yyyy");
  };

  const clearFilters = () => {
    setSearchTitle("");
    setMinAmount("");
    setSortByRecent(true);
  };

  const filteredOffers = useMemo(() => {
    let offers = [...loanOffers];

    if (searchTitle.trim()) {
      offers = offers.filter((offer) =>
        offer.title.toLowerCase().includes(searchTitle.toLowerCase()),
      );
    }

    if (minAmount.trim()) {
      const amount = Number(minAmount);
      if (!isNaN(amount)) {
        offers = offers.filter((offer) => Number(offer.maxAmount) >= amount);
      }
    }

    if (sortByRecent) {
      offers.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
    } else {
      offers.sort((a, b) => Number(a.maxAmount) - Number(b.maxAmount));
    }

    return offers;
  }, [loanOffers, searchTitle, minAmount, sortByRecent]);

  const isFiltering =
    searchTitle.trim() !== "" || minAmount.trim() !== "" || !sortByRecent;

  if (loading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <Skeleton className="h-16 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "grid" | "list")}
              className="hidden md:block"
            >
              <TabsList className="h-9">
                <TabsTrigger value="grid" className="px-3">
                  <div className="grid grid-cols-3 gap-0.5 h-4 w-4 mr-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-current rounded-sm" />
                    ))}
                  </div>
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <div className="flex flex-col gap-0.5 h-4 w-4 mr-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-current h-1 w-full rounded-sm"
                      />
                    ))}
                  </div>
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <Card className="border-muted">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Filter className="h-4 w-4" />
                      <span className="font-medium">Filters</span>
                      {isFiltering && (
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                {isFiltering && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-xs"
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Clear
                  </Button>
                )}
              </div>

              <CollapsibleContent className="space-y-4">
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="searchTitle"
                      className="text-xs font-medium"
                    >
                      Title
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="searchTitle"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minAmount" className="text-xs font-medium">
                      Minimum Amount
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="minAmount"
                        placeholder="Min amount"
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-8">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="sortRecent"
                        checked={sortByRecent}
                        onCheckedChange={setSortByRecent}
                      />
                      <Label
                        htmlFor="sortRecent"
                        className="text-sm flex items-center gap-1"
                      >
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort by {sortByRecent ? "newest" : "amount"}
                      </Label>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>
      </div>

      {filteredOffers.length === 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No offers available</h3>
            <p className="text-muted-foreground text-center">
              No loan offers match your criteria. Try adjusting your filters.
            </p>
            {isFiltering && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-muted"
              onClick={() => {
                setSelectedLoan(offer);
                setIsDialogOpen(true);
              }}
            >
              <CardContent className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 bg-emerald-50"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {offer.createdAt?.seconds &&
                      formatDate(offer.createdAt?.seconds)}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                  {offer.title}
                </h3>

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <User className="h-4 w-4" />
                  <p className="truncate">
                    {formatAddress(offer.lenderWallet)}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 rounded-full p-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Amount</p>
                    <p className="font-bold text-xl">${offer.maxAmount}</p>
                  </div>
                </div>

                {offer.milestones?.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Milestone className="h-3.5 w-3.5" />
                    <span>
                      {offer.milestones.length} milestone
                      {offer.milestones.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-0">
                <div className="w-full px-6 py-3 bg-muted/30 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group-hover:translate-x-1 transition-transform"
                  >
                    View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group border-muted"
              onClick={() => {
                setSelectedLoan(offer);
                setIsDialogOpen(true);
              }}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold group-hover:text-emerald-600 transition-colors">
                        {offer.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs"
                      >
                        Approved
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <User className="h-3.5 w-3.5" />
                      <p className="truncate">
                        {formatAddress(offer.lenderWallet)}
                      </p>
                      <span className="text-muted-foreground/50">•</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {offer.createdAt?.seconds &&
                          formatDate(offer.createdAt?.seconds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 rounded-full p-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-bold text-lg">${offer.maxAmount}</p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group-hover:translate-x-1 transition-transform"
                    >
                      View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MarketplaceLoanDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedLoan={selectedLoan}
        setSelectedLoan={setSelectedLoan}
      />
    </div>
  );
}
