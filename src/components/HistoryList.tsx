import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface HistoryItem {
  id: string;
  name: string;
  email: string;
  accountId: string;
  timestamp: string;
  avatar?: string;
}

interface HistoryListProps {
  items: HistoryItem[];
}

const HistoryList = ({ items }: HistoryListProps) => {
  if (items.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <div className="text-muted-foreground">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No accounts created yet</p>
          <p className="text-sm mt-2">Scan QR codes to create accounts</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="p-4 bg-card border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground truncate">{item.email}</p>
              <p className="text-xs text-primary font-mono mt-1">{item.accountId}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{new Date(item.timestamp).toLocaleDateString()}</p>
              <p>{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HistoryList;
