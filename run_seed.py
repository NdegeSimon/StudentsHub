# run_seed.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server.seed import seed_database

if __name__ == '__main__':
    # Clear existing data and seed with new data
    seed_database(clear=True)
