"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, User, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getApprovedLoanOffers } from "../../server/marketplace.firebase";
import MarketplaceLoanDetailDialog from "../dialogs/MarketplaceLoanDetailDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function MarketplaceOffersList() {
  const [loanOffers, setLoanOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any | undefined>(undefined);

  const [searchTitle, setSearchTitle] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [sortByRecent, setSortByRecent] = useState(true);

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
    return format(new Date(seconds * 1000), "dd/MM/yyyy | HH:mm");
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
    }

    return offers;
  }, [loanOffers, searchTitle, minAmount, sortByRecent]);

  const isFiltering =
    searchTitle.trim() !== "" || minAmount.trim() !== "" || !sortByRecent;

  if (loading) {
    return (
      <div className="p-8 flex flex-col gap-6">
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
    <div className="p-8 flex flex-col gap-6">
      <Card className="border-muted">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Filters</h3>
              {isFiltering && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="searchTitle" className="text-xs font-medium">
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
              <Switch
                id="sortRecent"
                checked={sortByRecent}
                onCheckedChange={setSortByRecent}
              />
              <Label htmlFor="sortRecent" className="text-sm">
                Sort by newest
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredOffers.length === 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No offers available</h3>
            <p className="text-muted-foreground text-center">
              No loan offers match your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <Card
            key={offer.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              setSelectedLoan(offer);
              setIsDialogOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold truncate">
                  {offer.title}
                </h3>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600 bg-green-50"
                >
                  Approved
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <User className="h-4 w-4" />
                <p className="truncate">{formatAddress(offer.lenderWallet)}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="bg-muted/30 rounded-full p-1">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-medium text-xl">${offer.maxAmount}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Created:</span>
                </div>
                <span>
                  {offer.createdAt?.seconds &&
                    formatDate(offer.createdAt?.seconds)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MarketplaceLoanDetailDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedLoan={selectedLoan}
        setSelectedLoan={setSelectedLoan}
      />
    </div>
  );
}
