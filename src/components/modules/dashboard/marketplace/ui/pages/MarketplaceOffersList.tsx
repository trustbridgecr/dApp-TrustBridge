"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Search,
  Star,
  Calendar,
  DollarSign,
  Clock,
  Percent,
  Shield,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getApprovedLoanOffers } from "../../server/marketplace.firebase";
import MarketplaceLoanDetailDialog from "../dialogs/MarketplaceLoanDetailDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApprovedLoan } from "../../store/marketplace";

export default function MarketplaceOffersList() {
  const [loanOffers, setLoanOffers] = useState<ApprovedLoan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<ApprovedLoan | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loanAmountRange, setLoanAmountRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("Relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [lenderRating, setLenderRating] = useState({
    fourPlus: false,
    threePlus: false,
    twoPlus: false,
    onePlus: false,
  });
  const [loanTerm, setLoanTerm] = useState({
    days30: false,
    days90: false,
    days180: false,
    year1: false,
    year2Plus: false,
  });
  const [loanType, setLoanType] = useState({
    personal: false,
    business: false,
    mortgage: false,
    auto: false,
    student: false,
    crypto: false,
  });

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
    setSearchQuery("");
    setLoanAmountRange([0, 1000]);
    setSelectedCategory("All Categories");
    setSortOption("Relevance");
    setLenderRating({
      fourPlus: false,
      threePlus: false,
      twoPlus: false,
      onePlus: false,
    });
    setLoanTerm({
      days30: false,
      days90: false,
      days180: false,
      year1: false,
      year2Plus: false,
    });
    setLoanType({
      personal: false,
      business: false,
      mortgage: false,
      auto: false,
      student: false,
      crypto: false,
    });
  };

  const isFiltering =
    searchQuery.trim() !== "" ||
    loanAmountRange[0] > 0 ||
    loanAmountRange[1] < 1000 ||
    selectedCategory !== "All Categories" ||
    sortOption !== "Relevance" ||
    Object.values(lenderRating).some(Boolean) ||
    Object.values(loanTerm).some(Boolean) ||
    Object.values(loanType).some(Boolean);

  const filteredOffers = useMemo(() => {
    let offers = [...loanOffers];

    if (searchQuery.trim()) {
      offers = offers.filter((offer) =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply loan amount range filter
    offers = offers.filter(
      (offer) =>
        Number(offer.maxAmount) >= loanAmountRange[0] &&
        Number(offer.maxAmount) <= loanAmountRange[1],
    );

    // Filter by category if not "All Categories"
    if (selectedCategory !== "All Categories") {
      // In a real implementation, you would filter by the actual category
      // For now, we'll just simulate this since the data doesn't have categories
      const categoryIndex = [
        "Personal",
        "Business",
        "Mortgage",
        "Auto",
        "Student",
        "Crypto",
      ].indexOf(selectedCategory);
      if (categoryIndex >= 0) {
        offers = offers.filter((_, index) => index % 6 === categoryIndex);
      }
    }

    // Sort offers based on selected option
    if (sortOption === "Newest") {
      offers.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
    } else if (sortOption === "Amount: Low to High") {
      offers.sort((a, b) => Number(a.maxAmount) - Number(b.maxAmount));
    } else if (sortOption === "Amount: High to Low") {
      offers.sort((a, b) => Number(b.maxAmount) - Number(a.maxAmount));
    }

    return offers;
  }, [loanOffers, searchQuery, loanAmountRange, selectedCategory, sortOption]);

  const categories = [
    "All Categories",
    "Personal",
    "Business",
    "Mortgage",
    "Auto",
    "Student",
    "Crypto",
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Personal":
        return <Badge className="bg-emerald-600">Personal</Badge>;
      case "Business":
        return <Badge className="bg-emerald-600">Business</Badge>;
      case "Mortgage":
        return <Badge className="bg-emerald-600">Mortgage</Badge>;
      case "Auto":
        return <Badge className="bg-emerald-600">Auto</Badge>;
      case "Student":
        return <Badge className="bg-emerald-600">Student</Badge>;
      case "Crypto":
        return <Badge className="bg-emerald-600">Crypto</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-emerald-500 text-emerald-500"
                : "fill-muted stroke-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

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
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 p-4 md:p-6 border-r">
          <div className="space-y-6">
            {/* Loan Amount Range */}
            <div className="space-y-2">
              <h3 className="font-medium">Loan Amount</h3>
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={1}
                value={loanAmountRange}
                onValueChange={setLoanAmountRange}
                className="my-6"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{loanAmountRange[0]} XLM</span>
                <span>{loanAmountRange[1]} XLM</span>
              </div>
            </div>

            <Separator />

            {/* Lender Rating */}
            <div className="space-y-3">
              <h3 className="font-medium">Lender Rating</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="4stars"
                    checked={lenderRating.fourPlus}
                    onCheckedChange={(checked) =>
                      setLenderRating({ ...lenderRating, fourPlus: !!checked })
                    }
                  />
                  <Label htmlFor="4stars" className="text-sm">
                    4+ stars
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="3stars"
                    checked={lenderRating.threePlus}
                    onCheckedChange={(checked) =>
                      setLenderRating({ ...lenderRating, threePlus: !!checked })
                    }
                  />
                  <Label htmlFor="3stars" className="text-sm">
                    3+ stars
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="2stars"
                    checked={lenderRating.twoPlus}
                    onCheckedChange={(checked) =>
                      setLenderRating({ ...lenderRating, twoPlus: !!checked })
                    }
                  />
                  <Label htmlFor="2stars" className="text-sm">
                    2+ stars
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="1stars"
                    checked={lenderRating.onePlus}
                    onCheckedChange={(checked) =>
                      setLenderRating({ ...lenderRating, onePlus: !!checked })
                    }
                  />
                  <Label htmlFor="1stars" className="text-sm">
                    1+ stars
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Loan Term */}
            <div className="space-y-3">
              <h3 className="font-medium">Loan Term</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="30days"
                    checked={loanTerm.days30}
                    onCheckedChange={(checked) =>
                      setLoanTerm({ ...loanTerm, days30: !!checked })
                    }
                  />
                  <Label htmlFor="30days" className="text-sm">
                    Up to 30 days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="90days"
                    checked={loanTerm.days90}
                    onCheckedChange={(checked) =>
                      setLoanTerm({ ...loanTerm, days90: !!checked })
                    }
                  />
                  <Label htmlFor="90days" className="text-sm">
                    Up to 90 days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="180days"
                    checked={loanTerm.days180}
                    onCheckedChange={(checked) =>
                      setLoanTerm({ ...loanTerm, days180: !!checked })
                    }
                  />
                  <Label htmlFor="180days" className="text-sm">
                    Up to 180 days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="1year"
                    checked={loanTerm.year1}
                    onCheckedChange={(checked) =>
                      setLoanTerm({ ...loanTerm, year1: !!checked })
                    }
                  />
                  <Label htmlFor="1year" className="text-sm">
                    Up to 1 year
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="2yearsPlus"
                    checked={loanTerm.year2Plus}
                    onCheckedChange={(checked) =>
                      setLoanTerm({ ...loanTerm, year2Plus: !!checked })
                    }
                  />
                  <Label htmlFor="2yearsPlus" className="text-sm">
                    2+ years
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Loan Type */}
            <div className="space-y-3">
              <h3 className="font-medium">Loan Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal"
                    checked={loanType.personal}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, personal: !!checked })
                    }
                  />
                  <Label htmlFor="personal" className="text-sm">
                    Personal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="business"
                    checked={loanType.business}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, business: !!checked })
                    }
                  />
                  <Label htmlFor="business" className="text-sm">
                    Business
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mortgage"
                    checked={loanType.mortgage}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, mortgage: !!checked })
                    }
                  />
                  <Label htmlFor="mortgage" className="text-sm">
                    Mortgage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto"
                    checked={loanType.auto}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, auto: !!checked })
                    }
                  />
                  <Label htmlFor="auto" className="text-sm">
                    Auto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="student"
                    checked={loanType.student}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, student: !!checked })
                    }
                  />
                  <Label htmlFor="student" className="text-sm">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="crypto"
                    checked={loanType.crypto}
                    onCheckedChange={(checked) =>
                      setLoanType({ ...loanType, crypto: !!checked })
                    }
                  />
                  <Label htmlFor="crypto" className="text-sm">
                    Crypto
                  </Label>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={clearFilters}
              disabled={!isFiltering}
            >
              {isFiltering ? "Clear Filters" : "Apply Filters"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Search and Sort */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search loans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Relevance">Relevance</SelectItem>
                    <SelectItem value="Newest">Newest</SelectItem>
                    <SelectItem value="Amount: Low to High">
                      Amount: Low to High
                    </SelectItem>
                    <SelectItem value="Amount: High to Low">
                      Amount: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

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

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={
                    selectedCategory === category
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : ""
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredOffers.length === 0 && (
            <Card className="overflow-hidden">
              <CardContent className="p-16 flex flex-col items-center justify-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  No offers available
                </h3>
                <p className="text-muted-foreground text-center">
                  No loan offers match your criteria. Try adjusting your
                  filters.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer, index) => {
                // Assign a category based on index for demo purposes
                const categories = [
                  "Personal",
                  "Business",
                  "Mortgage",
                  "Auto",
                  "Student",
                  "Crypto",
                ];
                const category = categories[index % categories.length];

                // Generate a random rating between 3.5 and 5.0
                const rating = 3.5 + Math.random() * 1.5;

                // Generate random interest rate between 2% and 15%
                const interestRate = (2 + Math.random() * 13).toFixed(2);

                // Generate random loan term in months (3-60)
                const loanTermMonths = Math.floor(3 + Math.random() * 57);

                return (
                  <Card
                    key={offer.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      setSelectedLoan(offer);
                      setIsDialogOpen(true);
                    }}
                  >
                    <div className="relative h-12 bg-emerald-600 flex items-center px-4">
                      <h3 className="font-semibold text-white">
                        {offer.title}
                      </h3>
                      <div className="absolute top-2 right-2">
                        {getCategoryBadge(category)}
                      </div>
                    </div>
                    <CardContent className="p-4 pt-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center text-xs text-muted-foreground">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium">
                          {formatAddress(offer.lenderWallet || "")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-100 rounded-full p-1.5">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Loan Amount
                            </p>
                            <p className="font-semibold">${offer.maxAmount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-100 rounded-full p-1.5">
                            <Percent className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Interest Rate
                            </p>
                            <p className="font-semibold">{interestRate}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-100 rounded-full p-1.5">
                            <Clock className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Term Length
                            </p>
                            <p className="font-semibold">
                              {loanTermMonths} months
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-100 rounded-full p-1.5">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Listed Date
                            </p>
                            <p className="font-semibold">
                              {offer.createdAt?.seconds
                                ? formatDate(offer.createdAt.seconds)
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center gap-1 mr-3">
                          <Shield className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs">Verified Lender</span>
                        </div>
                        {renderStars(rating)}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4 border-t bg-muted/20">
                      <div className="text-sm text-muted-foreground">
                        {offer.milestones?.length || 0} milestone
                        {offer.milestones?.length !== 1 ? "s" : ""}
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOffers.map((offer, index) => {
                // Assign a category based on index for demo purposes
                const categories = [
                  "Personal",
                  "Business",
                  "Mortgage",
                  "Auto",
                  "Student",
                  "Crypto",
                ];
                const category = categories[index % categories.length];

                return (
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
                            {getCategoryBadge(category)}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <User className="h-3.5 w-3.5" />
                            <p className="truncate">
                              {formatAddress(offer.lenderWallet || "Unknown")}
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
                              <p className="text-xs text-muted-foreground">
                                Amount
                              </p>
                              <p className="font-bold text-lg">
                                ${offer.maxAmount}
                              </p>
                            </div>
                          </div>

                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
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
