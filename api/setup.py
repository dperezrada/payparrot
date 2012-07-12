from setuptools import setup, find_packages
import sys, os

version = '0.1'

setup(name='payparrot_api',
      version=version,
      description="",
      long_description="""\
""",
      classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='',
      author='',
      author_email='',
      url='',
      license='',
      packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
      include_package_data=True,
      zip_safe=False,
      install_requires=[
        "bottle==0.10.11", "oauth2", "boto", "python-dateutil"
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
