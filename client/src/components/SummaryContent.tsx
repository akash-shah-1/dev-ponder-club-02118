import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface UpgradeViewProps {
    showUpgrade: boolean;
    setShowUpgrade: (show: boolean) => void;
    isMobile: boolean;
}

export const UpgradeView = ({ showUpgrade, setShowUpgrade, isMobile }: UpgradeViewProps) => {
    const UpgradeContent = () => (
        <div className="space-y-4 py-4">
            <div className="text-center">
                <p className="text-muted-foreground mb-4">
                    This content is too long for the free voice tier.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <h3 className="text-xl font-bold mb-2">Premium Voice Features</h3>
                    <ul className="text-left space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Unlimited voice length
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Premium voice quality
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Multiple voice options
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600">✓</span> Faster generation
                        </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-2xl font-bold text-purple-600">$5/month</p>
                        <p className="text-xs text-muted-foreground">Cancel anytime</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpgrade(false)}>
                    Maybe Later
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Upgrade Now
                </Button>
            </div>
        </div>
    );
    if (isMobile) {
        return (
            <Drawer open={showUpgrade} onOpenChange={setShowUpgrade}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-xl font-bold text-center">🎙️ Upgrade to Premium Voice</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <UpgradeContent />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }
    return (
        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">🎙️ Upgrade to Premium Voice</DialogTitle>
                </DialogHeader>
                <UpgradeContent />
            </DialogContent>
        </Dialog>
    )
}
