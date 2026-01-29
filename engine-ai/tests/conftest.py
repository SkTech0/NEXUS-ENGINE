"""Engine AI test configuration."""
import sys
from pathlib import Path

# Ensure engine-ai root is on path when running pytest from engine-ai/tests or engine-ai
_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))
